import assert from "node:assert/strict";
import test from "node:test";
import { randomUUID } from "node:crypto";
import { LocalStorageAdapter } from "../lib/storage/local-storage.adapter";
import { normalizeMediaFolder } from "../lib/media/media-folders";
import { serializeMediaAsset } from "../lib/media/media-asset.dto";
import { normalizePageContent } from "../lib/content/normalize-page-content";
import { canonicalContentEqual } from "../lib/content/content-equality";
import { mediaReferenceSchema } from "../validations/content/media-reference.schema";

test("local storage preserves the requested folder key and verifies the file", async () => {
  const storage = new LocalStorageAdapter();
  const key = `content-hub-test/${randomUUID()}.webp`;
  const uploaded = await storage.upload(Buffer.from([1, 2, 3]), key, "image/webp");
  try {
    assert.equal(uploaded.storageKey, key);
    assert.equal(uploaded.url, `/uploads/${key}`);
    assert.equal(await storage.exists(key), true);
  } finally {
    await storage.delete(key);
  }
  assert.equal(await storage.exists(key), false);
});

test("folder normalization removes traversal and aliases brand to branding", () => {
  assert.equal(normalizeMediaFolder("Brand"), "branding");
  assert.equal(normalizeMediaFolder("  Héरो / ../ Heroes "), "he-heroes");
});

test("MediaAsset serializer returns the canonical DTO shape", () => {
  const dto = serializeMediaAsset({
    id: "asset-1", fileName: "heroes/a.webp", originalName: "Ảnh hero.png",
    url: "heroes/a.webp", storageKey: "heroes/a.webp", mimeType: "image/webp",
    originalMimeType: "image/png", size: 10, width: 2, height: 1, alt: "Hero",
    title: "Title", folder: "heroes", folderId: null, provider: "local",
    uploadedBy: "owner@example.com", isDeleted: false, deletedAt: null,
    createdAt: new Date("2026-07-16T00:00:00.000Z"), updatedAt: new Date("2026-07-16T00:00:00.000Z"),
  });
  assert.equal(dto.url, "/uploads/heroes/a.webp");
  assert.equal(dto.originalName, "Ảnh hero.png");
  assert.equal(dto.createdAt, "2026-07-16T00:00:00.000Z");
});

test("legacy object image strings normalize to MediaReference without losing the URL", () => {
  const normalized = normalizePageContent({ hero: { image: "/uploads/hero.webp" } }, "home") as any;
  assert.deepEqual(normalized.hero.image, {
    mediaId: null,
    src: "/uploads/hero.webp",
    alt: "Elegant luxury manicure at Aera Nail Lounge",
    title: null,
  });
});

test("canonical equality ignores property order and optional media metadata", () => {
  const left = { hero: { image: { src: "/uploads/a.webp", alt: "A", mediaId: null } } };
  const right = { hero: { image: { title: null, alt: "A", src: "/uploads/a.webp" } } };
  assert.equal(canonicalContentEqual(left, right, "home"), true);
});

test("media reference schema preserves mediaId and title", () => {
  assert.deepEqual(mediaReferenceSchema.parse({ mediaId: "id", src: "/uploads/a.webp", alt: "A", title: "T" }), {
    mediaId: "id", src: "/uploads/a.webp", alt: "A", title: "T",
  });
});
