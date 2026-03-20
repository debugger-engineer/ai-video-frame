import { describe, it, expect, beforeAll, vi } from "vitest";
import request from "supertest";
import type { Express } from "express";

// Mock resend to avoid real email sending (Resend is instantiated at module level in auth/routes.ts)
vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = {
      send: vi.fn().mockResolvedValue({ data: { id: "mock-email-id" }, error: null }),
    };
  },
}));

// Mock storage to avoid real database calls
vi.mock("../../server/storage.ts", () => ({
  storage: {
    getVideosByUser: vi.fn().mockResolvedValue([]),
    createVideo: vi.fn().mockResolvedValue({ id: "test-id", status: "uploaded" }),
    getVideo: vi.fn().mockResolvedValue(null),
    updateVideo: vi.fn().mockResolvedValue(null),
    deleteVideo: vi.fn().mockResolvedValue(undefined),
    deleteAllUserVideos: vi.fn().mockResolvedValue(undefined),
    getAllProcessingVideos: vi.fn().mockResolvedValue([]),
    deleteStaleUploadedVideos: vi.fn().mockResolvedValue([]),
    getLatestVideoByUser: vi.fn().mockResolvedValue(null),
  },
}));

vi.mock("../../server/auth/storage.ts", () => ({
  authStorage: {
    getUser: vi.fn().mockResolvedValue(null),
    getUserByEmail: vi.fn().mockResolvedValue(null),
    upsertUser: vi.fn().mockResolvedValue({ id: "user-id", email: "test@test.com" }),
    createVerificationToken: vi.fn().mockResolvedValue({}),
    getVerificationToken: vi.fn().mockResolvedValue(null),
    deleteVerificationToken: vi.fn().mockResolvedValue(undefined),
  },
}));

let app: Express;

beforeAll(async () => {
  const { createTestApp } = await import("./setup.ts");
  ({ app } = await createTestApp());
});

describe("GET /api/videos — unauthenticated", () => {
  it("returns 401", async () => {
    const res = await request(app).get("/api/videos");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });
});

describe("POST /api/videos/upload — unauthenticated", () => {
  it("returns 401 before processing", async () => {
    const res = await request(app)
      .post("/api/videos/upload")
      .field("aspectRatio", "9:16");
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/videos/:id — unauthenticated", () => {
  it("returns 401", async () => {
    const res = await request(app).delete("/api/videos/some-id");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/videos/latest — unauthenticated", () => {
  it("returns 401", async () => {
    const res = await request(app).get("/api/videos/latest");
    expect(res.status).toBe(401);
  });
});

describe("GET /api/videos/:id — unauthenticated", () => {
  it("returns 401", async () => {
    const res = await request(app).get("/api/videos/some-id");
    expect(res.status).toBe(401);
  });
});
