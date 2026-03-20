import { describe, it, expect } from "vitest";
import { cn } from "../../client/src/lib/utils.ts";
import { isUnauthorizedError } from "../../client/src/lib/auth-utils.ts";

describe("cn (class name utility)", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "excluded", "included")).toBe("base included");
  });

  it("resolves tailwind conflicts (last wins)", () => {
    // tailwind-merge should deduplicate conflicting utilities
    const result = cn("p-2", "p-4");
    expect(result).toBe("p-4");
  });

  it("handles undefined and null gracefully", () => {
    expect(cn("a", undefined, null, "b")).toBe("a b");
  });
});

describe("isUnauthorizedError", () => {
  it("returns true for a 401 Unauthorized error", () => {
    const err = new Error("401: Unauthorized");
    expect(isUnauthorizedError(err)).toBe(true);
  });

  it("returns false for a 403 error", () => {
    const err = new Error("403: Forbidden");
    expect(isUnauthorizedError(err)).toBe(false);
  });

  it("returns false for a generic error", () => {
    const err = new Error("Something went wrong");
    expect(isUnauthorizedError(err)).toBe(false);
  });

  it("returns false for an empty error message", () => {
    const err = new Error("");
    expect(isUnauthorizedError(err)).toBe(false);
  });
});
