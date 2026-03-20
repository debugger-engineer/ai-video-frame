import { describe, it, expect } from "vitest";
import { calculateRequiredCredits } from "../../server/video-processing.ts";

describe("calculateRequiredCredits", () => {
  it("returns 1 for null duration (fallback)", () => {
    expect(calculateRequiredCredits(null)).toBe(1);
  });

  it("returns 1 for 0 seconds", () => {
    expect(calculateRequiredCredits(0)).toBe(1);
  });

  it("returns 1 for exactly 5 minutes", () => {
    expect(calculateRequiredCredits(300)).toBe(1);
  });

  it("returns 2 for 5:01", () => {
    expect(calculateRequiredCredits(301)).toBe(2);
  });

  it("returns 2 for exactly 6:00 (boundary)", () => {
    expect(calculateRequiredCredits(360)).toBe(2);
  });

  it("returns 3 for 6:01 (next partial minute)", () => {
    expect(calculateRequiredCredits(361)).toBe(3);
  });

  it("returns 6 for 10:00", () => {
    expect(calculateRequiredCredits(600)).toBe(6);
  });
});
