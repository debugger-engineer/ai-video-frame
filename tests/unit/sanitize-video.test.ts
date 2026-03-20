import { describe, it, expect } from "vitest";
import { sanitizeVideo } from "../../server/utils/sanitize.ts";

describe("sanitizeVideo", () => {
  it("strips originalPath and processedPath", () => {
    const input = {
      id: "abc",
      userId: "u1",
      status: "completed",
      originalPath: "/uploads/input/secret.mp4",
      processedPath: "/uploads/output/result.mp4",
    };
    const result = sanitizeVideo(input);
    expect(result).not.toHaveProperty("originalPath");
    expect(result).not.toHaveProperty("processedPath");
    expect(result).toMatchObject({ id: "abc", userId: "u1", status: "completed" });
  });

  it("works when paths are absent", () => {
    const input = { id: "x", userId: "u2", status: "uploaded" };
    const result = sanitizeVideo(input);
    expect(result).toEqual({ id: "x", userId: "u2", status: "uploaded" });
  });

  it("preserves all other fields", () => {
    const input = {
      id: "vid1",
      aspectRatio: "9:16",
      duration: 120,
      originalPath: "/some/path.mp4",
    };
    const result = sanitizeVideo(input);
    expect(result).toMatchObject({ id: "vid1", aspectRatio: "9:16", duration: 120 });
    expect(result).not.toHaveProperty("originalPath");
  });
});
