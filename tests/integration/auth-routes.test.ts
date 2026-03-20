import { describe, it, expect, beforeAll, vi } from "vitest";
import request from "supertest";
import type { Express } from "express";

// Mock storage to avoid real database calls
vi.mock("../../server/storage.ts", () => ({
  storage: {
    getVideosByUser: vi.fn().mockResolvedValue([]),
    getAllProcessingVideos: vi.fn().mockResolvedValue([]),
    deleteStaleUploadedVideos: vi.fn().mockResolvedValue([]),
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

// Mock Resend to avoid sending real emails (Resend is instantiated at module level in auth/routes.ts)
vi.mock("resend", () => ({
  Resend: class MockResend {
    emails = {
      send: vi.fn().mockResolvedValue({ data: { id: "mock-email-id" }, error: null }),
    };
  },
}));

let app: Express;

beforeAll(async () => {
  const { createTestApp } = await import("./setup.ts");
  ({ app } = await createTestApp());
});

describe("POST /api/auth/magic-link — input validation", () => {
  it("returns 400 for missing email", async () => {
    const res = await request(app).post("/api/auth/magic-link").send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid email/i);
  });

  it("returns 400 for malformed email (no @)", async () => {
    const res = await request(app)
      .post("/api/auth/magic-link")
      .send({ email: "notanemail" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/invalid email/i);
  });

  it("returns 400 for email without domain part", async () => {
    const res = await request(app)
      .post("/api/auth/magic-link")
      .send({ email: "user@" });
    expect(res.status).toBe(400);
  });

  it("returns 400 for a known disposable domain", async () => {
    const res = await request(app)
      .post("/api/auth/magic-link")
      .send({ email: "user@mailinator.com" });
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/disposable/i);
  });

  it("returns 200 for a valid non-disposable email", async () => {
    const res = await request(app)
      .post("/api/auth/magic-link")
      .send({ email: "user@gmail.com" });
    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/magic link sent/i);
  });
});
