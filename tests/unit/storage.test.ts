import { describe, it, expect } from "vitest";
import {
  uploadFile,
  deleteFile,
  listFiles,
  isBlobConfigured,
  getMaxFileSize,
  getAllowedMimeTypes,
} from "@/lib/services/storage";

describe("Storage Service — Configuration", () => {
  it("reports blob as not configured in test env", () => {
    expect(isBlobConfigured()).toBe(false);
  });

  it("returns max file sizes for known categories", () => {
    expect(getMaxFileSize("listing_photo")).toBe(10 * 1024 * 1024);
    expect(getMaxFileSize("document")).toBe(25 * 1024 * 1024);
    expect(getMaxFileSize("evidence")).toBe(25 * 1024 * 1024);
    expect(getMaxFileSize("profile")).toBe(5 * 1024 * 1024);
  });

  it("returns default max size for unknown category", () => {
    expect(getMaxFileSize("unknown")).toBe(10 * 1024 * 1024);
  });

  it("returns allowed MIME types for listing photos", () => {
    const types = getAllowedMimeTypes("listing_photo");
    expect(types).toContain("image/jpeg");
    expect(types).toContain("image/png");
    expect(types).toContain("image/webp");
  });

  it("returns allowed MIME types for documents", () => {
    const types = getAllowedMimeTypes("document");
    expect(types).toContain("application/pdf");
  });

  it("returns empty array for unknown category", () => {
    expect(getAllowedMimeTypes("unknown")).toEqual([]);
  });
});

describe("Storage Service — Mock Upload", () => {
  it("uploads a file in mock mode", async () => {
    const file = new Blob(["test content"], { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 1024 });
    Object.defineProperty(file, "type", { value: "image/jpeg" });

    const result = await uploadFile(file, "test.jpg", "listing_photo");
    expect(result.success).toBe(true);
    expect(result.url).toContain("mock-storage");
    expect(result.fileKey).toContain("listing_photo");
  });

  it("rejects files exceeding size limit", async () => {
    const file = new Blob(["x"], { type: "image/jpeg" });
    Object.defineProperty(file, "size", { value: 15 * 1024 * 1024 }); // 15MB > 10MB limit

    const result = await uploadFile(file, "big.jpg", "listing_photo");
    expect(result.success).toBe(false);
    expect(result.error).toContain("troppo grande");
  });

  it("rejects invalid MIME types", async () => {
    const file = new Blob(["test"], { type: "application/exe" });
    Object.defineProperty(file, "size", { value: 1024 });
    Object.defineProperty(file, "type", { value: "application/exe" });

    const result = await uploadFile(file, "malware.exe", "listing_photo");
    expect(result.success).toBe(false);
    expect(result.error).toContain("non supportato");
  });
});

describe("Storage Service — Mock Delete & List", () => {
  it("deletes a file in mock mode", async () => {
    const result = await deleteFile("https://mock-storage.casastudente.it/test.jpg");
    expect(result.success).toBe(true);
  });

  it("lists files returns empty in mock mode", async () => {
    const files = await listFiles("listing_photo");
    expect(files).toEqual([]);
  });
});
