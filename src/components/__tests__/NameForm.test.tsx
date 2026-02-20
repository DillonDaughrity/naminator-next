import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import NameForm from "@/components/NameForm";

// Sample history item for tests
const sampleHistory = [
  {
    id: 1,
    name1: "Alice",
    name2: "Bob",
    createdAt: "2026-01-01T00:00:00.000Z",
    results: [{ id: 10, name: "Alicob", goodness: 4.0 }],
  },
];

// Sample API response for a successful POST
const sampleNewSet = {
  id: 2,
  name1: "John",
  name2: "Jane",
  createdAt: "2026-02-01T00:00:00.000Z",
  results: [{ id: 20, name: "Jocob", goodness: 4.2 }],
};

function makeOkFetch(data: unknown) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  });
}

function makeErrorFetch(errorBody: { error: string }) {
  return vi.fn().mockResolvedValue({
    ok: false,
    json: async () => errorBody,
  });
}

describe("NameForm", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // ------------------------------------------------------------------
  // Initial render
  // ------------------------------------------------------------------

  describe("initial render", () => {
    it("renders two name input fields", () => {
      render(<NameForm initialHistory={[]} />);
      expect(screen.getByLabelText("First Name")).toBeInTheDocument();
      expect(screen.getByLabelText("Second Name")).toBeInTheDocument();
    });

    it("renders the submit button", () => {
      render(<NameForm initialHistory={[]} />);
      expect(
        screen.getByRole("button", { name: /generate names/i })
      ).toBeInTheDocument();
    });

    it("shows empty state message when initialHistory is empty", () => {
      render(<NameForm initialHistory={[]} />);
      expect(screen.getByText(/no naminations yet/i)).toBeInTheDocument();
    });

    it("does NOT show empty state when initialHistory has items", () => {
      render(<NameForm initialHistory={sampleHistory} />);
      expect(screen.queryByText(/no naminations yet/i)).not.toBeInTheDocument();
    });

    it("renders history entries from initialHistory", () => {
      render(<NameForm initialHistory={sampleHistory} />);
      expect(screen.getByText("Alice")).toBeInTheDocument();
      expect(screen.getByText("Bob")).toBeInTheDocument();
    });
  });

  // ------------------------------------------------------------------
  // Form validation (client-side, no fetch call)
  // ------------------------------------------------------------------

  describe("form validation", () => {
    it("shows error when submitted with both fields empty", async () => {
      const user = userEvent.setup();
      render(<NameForm initialHistory={[]} />);
      await user.click(screen.getByRole("button", { name: /generate names/i }));
      expect(
        screen.getByText("Both names are required!")
      ).toBeInTheDocument();
    });

    it("shows error when name1 is empty and name2 is filled", async () => {
      const user = userEvent.setup();
      render(<NameForm initialHistory={[]} />);
      await user.type(screen.getByLabelText("Second Name"), "Jane");
      await user.click(screen.getByRole("button", { name: /generate names/i }));
      expect(
        screen.getByText("Both names are required!")
      ).toBeInTheDocument();
    });

    it("shows error when name2 is empty and name1 is filled", async () => {
      const user = userEvent.setup();
      render(<NameForm initialHistory={[]} />);
      await user.type(screen.getByLabelText("First Name"), "John");
      await user.click(screen.getByRole("button", { name: /generate names/i }));
      expect(
        screen.getByText("Both names are required!")
      ).toBeInTheDocument();
    });

    it("does NOT call fetch when validation fails", async () => {
      const user = userEvent.setup();
      render(<NameForm initialHistory={[]} />);
      await user.click(screen.getByRole("button", { name: /generate names/i }));
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  // ------------------------------------------------------------------
  // Successful submission
  // ------------------------------------------------------------------

  describe("successful submission", () => {
    beforeEach(() => {
      vi.stubGlobal("fetch", makeOkFetch(sampleNewSet));
    });

    it("calls fetch with POST method and correct URL", async () => {
      const user = userEvent.setup();
      render(<NameForm initialHistory={[]} />);
      await user.type(screen.getByLabelText("First Name"), "John");
      await user.type(screen.getByLabelText("Second Name"), "Jane");
      await user.click(screen.getByRole("button", { name: /generate names/i }));
      await waitFor(() =>
        expect(global.fetch).toHaveBeenCalledWith(
          "/api/name-combinations",
          expect.objectContaining({ method: "POST" })
        )
      );
    });

    it("sends trimmed name values in the request body", async () => {
      const user = userEvent.setup();
      render(<NameForm initialHistory={[]} />);
      await user.type(screen.getByLabelText("First Name"), "  John  ");
      await user.type(screen.getByLabelText("Second Name"), "  Jane  ");
      await user.click(screen.getByRole("button", { name: /generate names/i }));
      await waitFor(() => expect(global.fetch).toHaveBeenCalled());
      const [, options] = vi.mocked(global.fetch).mock.calls[0];
      const body = JSON.parse((options as RequestInit).body as string);
      expect(body.name1).toBe("John");
      expect(body.name2).toBe("Jane");
    });

    it("prepends new result to history after successful submission", async () => {
      const user = userEvent.setup();
      render(<NameForm initialHistory={[]} />);
      await user.type(screen.getByLabelText("First Name"), "John");
      await user.type(screen.getByLabelText("Second Name"), "Jane");
      await user.click(screen.getByRole("button", { name: /generate names/i }));
      await waitFor(() =>
        expect(screen.getByText("John")).toBeInTheDocument()
      );
      expect(screen.getByText("Jane")).toBeInTheDocument();
      expect(screen.queryByText(/no naminations yet/i)).not.toBeInTheDocument();
    });

    it("clears input fields after successful submission", async () => {
      const user = userEvent.setup();
      render(<NameForm initialHistory={[]} />);
      const input1 = screen.getByLabelText("First Name");
      const input2 = screen.getByLabelText("Second Name");
      await user.type(input1, "John");
      await user.type(input2, "Jane");
      await user.click(screen.getByRole("button", { name: /generate names/i }));
      await waitFor(() =>
        expect((input1 as HTMLInputElement).value).toBe("")
      );
      expect((input2 as HTMLInputElement).value).toBe("");
    });
  });

  // ------------------------------------------------------------------
  // Error handling
  // ------------------------------------------------------------------

  describe("error handling", () => {
    it("shows API error message when fetch returns ok:false", async () => {
      vi.stubGlobal("fetch", makeErrorFetch({ error: "Claude failed" }));
      const user = userEvent.setup();
      render(<NameForm initialHistory={[]} />);
      await user.type(screen.getByLabelText("First Name"), "John");
      await user.type(screen.getByLabelText("Second Name"), "Jane");
      await user.click(screen.getByRole("button", { name: /generate names/i }));
      await waitFor(() =>
        expect(screen.getByText("Claude failed")).toBeInTheDocument()
      );
    });

    it("shows generic error when fetch throws (network failure)", async () => {
      vi.stubGlobal(
        "fetch",
        vi.fn().mockRejectedValue(new Error("Network error"))
      );
      const user = userEvent.setup();
      render(<NameForm initialHistory={[]} />);
      await user.type(screen.getByLabelText("First Name"), "John");
      await user.type(screen.getByLabelText("Second Name"), "Jane");
      await user.click(screen.getByRole("button", { name: /generate names/i }));
      await waitFor(() =>
        expect(screen.getByText("Network error")).toBeInTheDocument()
      );
    });

    it("clears previous error on new successful submission attempt", async () => {
      // First, trigger an error
      vi.stubGlobal("fetch", makeErrorFetch({ error: "Claude failed" }));
      const user = userEvent.setup();
      render(<NameForm initialHistory={[]} />);
      await user.type(screen.getByLabelText("First Name"), "John");
      await user.type(screen.getByLabelText("Second Name"), "Jane");
      await user.click(screen.getByRole("button", { name: /generate names/i }));
      await waitFor(() =>
        expect(screen.getByText("Claude failed")).toBeInTheDocument()
      );

      // Now swap to a successful fetch and resubmit
      vi.stubGlobal("fetch", makeOkFetch(sampleNewSet));
      await user.type(screen.getByLabelText("First Name"), "John");
      await user.type(screen.getByLabelText("Second Name"), "Jane");
      await user.click(screen.getByRole("button", { name: /generate names/i }));
      await waitFor(() =>
        expect(screen.queryByText("Claude failed")).not.toBeInTheDocument()
      );
    });
  });
});
