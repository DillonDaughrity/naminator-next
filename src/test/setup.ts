import "@testing-library/jest-dom";
import { vi, beforeEach, afterEach } from "vitest";
import { TextEncoder, TextDecoder } from "util";

Object.assign(globalThis, { TextEncoder, TextDecoder });

beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});
