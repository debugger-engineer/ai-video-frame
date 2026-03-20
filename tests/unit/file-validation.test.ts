import { describe, it, expect } from "vitest";
import { ALLOWED_RATIOS } from "../../server/video-processing.ts";

describe("ALLOWED_RATIOS", () => {
  it("contains all expected aspect ratios", () => {
    expect(ALLOWED_RATIOS).toContain("9:16");
    expect(ALLOWED_RATIOS).toContain("1:1");
    expect(ALLOWED_RATIOS).toContain("4:5");
    expect(ALLOWED_RATIOS).toContain("16:9");
    expect(ALLOWED_RATIOS).toContain("2:3");
  });

  it("rejects unknown ratios", () => {
    expect(ALLOWED_RATIOS).not.toContain("3:4");
    expect(ALLOWED_RATIOS).not.toContain("random");
    expect(ALLOWED_RATIOS).not.toContain("");
  });

  it("has exactly 5 ratios", () => {
    expect(ALLOWED_RATIOS).toHaveLength(5);
  });
});

// Inline test of the multer fileFilter predicate logic
describe("file type validation logic", () => {
  const allowedExts = [".mp4", ".mov", ".avi"];
  const allowedMimeTypes = ["video/mp4", "video/quicktime", "video/x-msvideo", "video/avi"];

  function isAllowedFile(filename: string, mimetype: string): boolean {
    const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
    return allowedExts.includes(ext) && allowedMimeTypes.includes(mimetype);
  }

  it("accepts .mp4 with correct mime type", () => {
    expect(isAllowedFile("video.mp4", "video/mp4")).toBe(true);
  });

  it("accepts .mov with quicktime mime type", () => {
    expect(isAllowedFile("clip.MOV", "video/quicktime")).toBe(true);
  });

  it("accepts .avi with x-msvideo mime type", () => {
    expect(isAllowedFile("recording.avi", "video/x-msvideo")).toBe(true);
  });

  it("rejects .exe files", () => {
    expect(isAllowedFile("virus.exe", "application/x-msdownload")).toBe(false);
  });

  it("rejects mime type mismatch (valid ext, wrong mime)", () => {
    expect(isAllowedFile("video.mp4", "application/octet-stream")).toBe(false);
  });

  it("rejects valid mime type with wrong extension", () => {
    expect(isAllowedFile("file.txt", "video/mp4")).toBe(false);
  });
});
