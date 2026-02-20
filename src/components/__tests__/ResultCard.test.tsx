import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ResultCard from "@/components/ResultCard";

function renderCard(goodness: number, name = "TestName") {
  return render(<ResultCard result={{ id: 1, name, goodness }} />);
}

describe("ResultCard", () => {
  // ----------------------------------------------------------------
  // Basic rendering
  // ----------------------------------------------------------------

  describe("basic rendering", () => {
    it("displays the name prop", () => {
      renderCard(4.0, "Jocob");
      expect(screen.getByText("Jocob")).toBeInTheDocument();
    });

    it("displays goodness formatted to one decimal place", () => {
      renderCard(4.0);
      expect(screen.getByText("4.0")).toBeInTheDocument();
    });

    it("displays goodness 3.7 as '3.7' (not '3.70')", () => {
      renderCard(3.7);
      expect(screen.getByText("3.7")).toBeInTheDocument();
    });

    it("renders exactly 5 star elements", () => {
      renderCard(3.0);
      const stars = screen.getAllByText("★");
      expect(stars).toHaveLength(5);
    });
  });

  // ----------------------------------------------------------------
  // getScoreColor — score badge color classes
  // ----------------------------------------------------------------

  describe("getScoreColor", () => {
    // The score badge is the element that shows the formatted goodness score.
    // We find it by its text content and check its CSS class.

    it("applies green class when goodness >= 4.0", () => {
      renderCard(4.0);
      expect(screen.getByText("4.0")).toHaveClass("text-green-400");
    });

    it("applies green class when goodness is 5.0", () => {
      renderCard(5.0);
      expect(screen.getByText("5.0")).toHaveClass("text-green-400");
    });

    it("applies green class when goodness is 4.5", () => {
      renderCard(4.5);
      expect(screen.getByText("4.5")).toHaveClass("text-green-400");
    });

    it("applies yellow class when goodness is 3.0", () => {
      renderCard(3.0);
      expect(screen.getByText("3.0")).toHaveClass("text-yellow-400");
    });

    it("applies yellow class when goodness is 3.9", () => {
      renderCard(3.9);
      expect(screen.getByText("3.9")).toHaveClass("text-yellow-400");
    });

    it("applies orange class when goodness is 2.0", () => {
      renderCard(2.0);
      expect(screen.getByText("2.0")).toHaveClass("text-orange-400");
    });

    it("applies orange class when goodness is 2.9", () => {
      renderCard(2.9);
      expect(screen.getByText("2.9")).toHaveClass("text-orange-400");
    });

    it("applies red class when goodness is 1.9", () => {
      renderCard(1.9);
      expect(screen.getByText("1.9")).toHaveClass("text-red-400");
    });

    it("applies red class when goodness is 0.0", () => {
      renderCard(0.0);
      expect(screen.getByText("0.0")).toHaveClass("text-red-400");
    });
  });

  // ----------------------------------------------------------------
  // getEmoji
  // ----------------------------------------------------------------

  describe("getEmoji", () => {
    it("shows trophy emoji when goodness >= 4.5", () => {
      renderCard(4.5);
      expect(screen.getByText("🏆")).toBeInTheDocument();
    });

    it("shows trophy emoji when goodness is 5.0", () => {
      renderCard(5.0);
      expect(screen.getByText("🏆")).toBeInTheDocument();
    });

    it("shows star emoji when goodness >= 4.0 and < 4.5", () => {
      renderCard(4.0);
      expect(screen.getByText("⭐")).toBeInTheDocument();
    });

    it("shows star emoji when goodness is 4.4", () => {
      renderCard(4.4);
      expect(screen.getByText("⭐")).toBeInTheDocument();
    });

    it("shows thumbs up emoji when goodness >= 3.0 and < 4.0", () => {
      renderCard(3.0);
      expect(screen.getByText("👍")).toBeInTheDocument();
    });

    it("shows thumbs up emoji when goodness is 3.9", () => {
      renderCard(3.9);
      expect(screen.getByText("👍")).toBeInTheDocument();
    });

    it("shows shrug emoji when goodness >= 2.0 and < 3.0", () => {
      renderCard(2.0);
      expect(screen.getByText("🤷")).toBeInTheDocument();
    });

    it("shows grimace emoji when goodness < 2.0", () => {
      renderCard(1.9);
      expect(screen.getByText("😬")).toBeInTheDocument();
    });

    it("shows grimace emoji when goodness is 0.0", () => {
      renderCard(0.0);
      expect(screen.getByText("😬")).toBeInTheDocument();
    });
  });

  // ----------------------------------------------------------------
  // Star rating display
  // Stars are rendered as <span> elements containing "★".
  // Index 0–4 map to positions 1–5 in the rating.
  // Full star: "text-yellow-400"
  // Half star: "text-yellow-400/50"  (i === fullStars && hasHalfStar)
  // Empty star: "text-gray-600"
  // ----------------------------------------------------------------

  describe("star rating display", () => {
    function getStars() {
      return screen.getAllByText("★");
    }

    it("renders 3 full, 0 half, 2 empty for goodness 3.0", () => {
      renderCard(3.0);
      const stars = getStars();
      expect(stars[0]).toHaveClass("text-yellow-400");
      expect(stars[1]).toHaveClass("text-yellow-400");
      expect(stars[2]).toHaveClass("text-yellow-400");
      expect(stars[3]).toHaveClass("text-gray-600");
      expect(stars[4]).toHaveClass("text-gray-600");
    });

    it("renders 3 full, 1 half, 1 empty for goodness 3.5", () => {
      renderCard(3.5);
      const stars = getStars();
      expect(stars[0]).toHaveClass("text-yellow-400");
      expect(stars[1]).toHaveClass("text-yellow-400");
      expect(stars[2]).toHaveClass("text-yellow-400");
      expect(stars[3]).toHaveClass("text-yellow-400/50");
      expect(stars[4]).toHaveClass("text-gray-600");
    });

    it("renders 4 full, 0 half, 1 empty for goodness 4.0", () => {
      renderCard(4.0);
      const stars = getStars();
      expect(stars[0]).toHaveClass("text-yellow-400");
      expect(stars[1]).toHaveClass("text-yellow-400");
      expect(stars[2]).toHaveClass("text-yellow-400");
      expect(stars[3]).toHaveClass("text-yellow-400");
      expect(stars[4]).toHaveClass("text-gray-600");
    });

    it("renders 4 full, 1 half, 0 empty for goodness 4.5", () => {
      renderCard(4.5);
      const stars = getStars();
      expect(stars[0]).toHaveClass("text-yellow-400");
      expect(stars[1]).toHaveClass("text-yellow-400");
      expect(stars[2]).toHaveClass("text-yellow-400");
      expect(stars[3]).toHaveClass("text-yellow-400");
      expect(stars[4]).toHaveClass("text-yellow-400/50");
    });

    it("renders 5 full, 0 half, 0 empty for goodness 5.0", () => {
      renderCard(5.0);
      const stars = getStars();
      for (const star of stars) {
        expect(star).toHaveClass("text-yellow-400");
        expect(star).not.toHaveClass("text-gray-600");
      }
    });

    it("renders 0 full, 0 half, 5 empty for goodness 0.0", () => {
      renderCard(0.0);
      const stars = getStars();
      for (const star of stars) {
        expect(star).toHaveClass("text-gray-600");
      }
    });

    it("renders 0 full, 1 half, 4 empty for goodness 0.5", () => {
      renderCard(0.5);
      const stars = getStars();
      expect(stars[0]).toHaveClass("text-yellow-400/50");
      expect(stars[1]).toHaveClass("text-gray-600");
      expect(stars[2]).toHaveClass("text-gray-600");
      expect(stars[3]).toHaveClass("text-gray-600");
      expect(stars[4]).toHaveClass("text-gray-600");
    });

    it("hasHalfStar is false for goodness 3.4 (no half-star class rendered)", () => {
      renderCard(3.4);
      const stars = getStars();
      for (const star of stars) {
        expect(star).not.toHaveClass("text-yellow-400/50");
      }
    });

    it("hasHalfStar is true for goodness 3.5 (half-star class rendered on index 3)", () => {
      renderCard(3.5);
      const stars = getStars();
      const halfStars = stars.filter((s) =>
        s.className.includes("text-yellow-400/50")
      );
      expect(halfStars).toHaveLength(1);
    });
  });
});
