import assert from "node:assert/strict";
import { loadEnvConfig } from "@next/env";
import sharp from "sharp";
import { signAdminSession } from "../lib/auth/require-admin";
import { prisma } from "../lib/db";
import { MAX_UPLOAD_SIZE } from "../lib/media/image-validation";
import type { MediaAssetDto } from "../lib/media/media-asset.dto";

const baseUrl = process.env.MEDIA_HTTP_BASE_URL || "http://localhost:3010";

loadEnvConfig(process.cwd(), true);

function blobFromBuffer(buffer: Buffer, type: string) {
  const bytes = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer;
  return new Blob([bytes], { type });
}

function adminCookie() {
  const email = process.env.ADMIN_EMAIL || "media-upload-integration@local.test";
  return `aera_admin_session=${signAdminSession({ email, role: "Owner" })}`;
}

async function upload(cookie: string | null, buffer: Buffer, fileName: string, type: string) {
  const form = new FormData();
  form.append("file", blobFromBuffer(buffer, type), fileName);
  form.append("folder", "content-integration");
  const response = await fetch(`${baseUrl}/api/admin/media/upload`, {
    method: "POST",
    headers: cookie ? { Cookie: cookie } : undefined,
    body: form,
  });
  const json = await response.json().catch(() => ({}));
  return { response, json } as { response: Response; json: { success?: boolean; code?: string; data?: MediaAssetDto; error?: string } };
}

function assertCanonicalDto(asset: MediaAssetDto | undefined, originalName: string) {
  assert(asset, `${originalName}: missing response data.`);
  for (const key of ["id", "fileName", "originalName", "url", "storageKey", "mimeType", "size", "width", "height", "alt", "title", "folder", "createdAt"]) {
    assert(Object.prototype.hasOwnProperty.call(asset, key), `${originalName}: canonical DTO is missing ${key}.`);
  }
  assert.equal(asset.originalName, originalName);
  assert.equal(asset.mimeType, "image/webp");
  assert.equal(asset.folder, "content-integration");
  assert(asset.url.startsWith("/uploads/content-integration/"));
  assert(asset.storageKey.startsWith("content-integration/"));
}

async function main() {
  const cookie = adminCookie();
  await prisma.mediaAsset.deleteMany({ where: { folder: "content-integration", isDeleted: true } });
  const startedAt = new Date();
  const createdIds: string[] = [];
  const createdUrls: string[] = [];
  const source = sharp({ create: { width: 32, height: 24, channels: 4, background: { r: 184, g: 139, b: 122, alpha: 0.5 } } });
  const jpeg = await source.clone().jpeg({ quality: 85 }).toBuffer();
  const png = await source.clone().png().toBuffer();
  const webp = await source.clone().webp().toBuffer();
  const avif = await source.clone().avif().toBuffer();

  try {
    const unauthorized = await upload(null, jpeg, "unauthorized.jpg", "image/jpeg");
    assert.equal(unauthorized.response.status, 401);
    console.log("PASS unauthorized upload rejected");

    const fake = await upload(cookie, Buffer.from("not an image"), "fake-extension.jpg", "image/jpeg");
    assert.equal(fake.response.status, 400);
    assert.equal(fake.json.code, "MEDIA_TYPE_UNSUPPORTED");
    console.log("PASS fake extension rejected by magic bytes");

    const tooLarge = await upload(cookie, Buffer.alloc(MAX_UPLOAD_SIZE + 1, 1), "too-large.jpg", "image/jpeg");
    assert.equal(tooLarge.response.status, 413);
    assert.equal(tooLarge.json.code, "MEDIA_FILE_TOO_LARGE");
    console.log("PASS file over 10MB rejected");

    const formats = [
      { buffer: jpeg, name: "ảnh hero có dấu và khoảng trắng.jpg", type: "image/jpeg" },
      { buffer: png, name: "transparent.png", type: "image/png" },
      { buffer: webp, name: "source.webp", type: "image/webp" },
      { buffer: avif, name: "source.avif", type: "image/avif" },
    ];
    for (const format of formats) {
      const result = await upload(cookie, format.buffer, format.name, format.type);
      if (result.json.data?.id) {
        createdIds.push(result.json.data.id);
        createdUrls.push(result.json.data.url);
      }
      assert.equal(result.response.status, 200, `${format.name}: ${JSON.stringify(result.json)}`);
      assertCanonicalDto(result.json.data, format.name);
      const direct = await fetch(`${baseUrl}${result.json.data!.url}`, { cache: "no-store" });
      assert.equal(direct.status, 200, `${format.name}: direct URL`);
      assert.equal(direct.headers.get("content-type"), "image/webp");
      console.log(`PASS ${format.type} -> canonical WebP DTO -> HTTP 200`);
    }

    const duplicateA = await upload(cookie, jpeg, "duplicate.jpg", "image/jpeg");
    const duplicateB = await upload(cookie, jpeg, "duplicate.jpg", "image/jpeg");
    if (duplicateA.json.data?.id) {
      createdIds.push(duplicateA.json.data.id);
      createdUrls.push(duplicateA.json.data.url);
    }
    if (duplicateB.json.data?.id) {
      createdIds.push(duplicateB.json.data.id);
      createdUrls.push(duplicateB.json.data.url);
    }
    assert.equal(duplicateA.response.status, 200);
    assert.equal(duplicateB.response.status, 200);
    assertCanonicalDto(duplicateA.json.data, "duplicate.jpg");
    assertCanonicalDto(duplicateB.json.data, "duplicate.jpg");
    assert.notEqual(duplicateA.json.data!.id, duplicateB.json.data!.id);
    assert.notEqual(duplicateA.json.data!.storageKey, duplicateB.json.data!.storageKey);
    console.log("PASS duplicate upload creates two independent canonical assets");

    const nearLimit = Buffer.concat([jpeg, Buffer.alloc(MAX_UPLOAD_SIZE - jpeg.length - 1)]);
    const nearResult = await upload(cookie, nearLimit, "near-10mb.jpg", "image/jpeg");
    if (nearResult.json.data?.id) {
      createdIds.push(nearResult.json.data.id);
      createdUrls.push(nearResult.json.data.url);
    }
    assert.equal(nearResult.response.status, 200, JSON.stringify(nearResult.json));
    assertCanonicalDto(nearResult.json.data, "near-10mb.jpg");
    console.log("PASS valid image immediately below 10MB accepted");

    const list = await fetch(`${baseUrl}/api/admin/media?folder=content-integration&pageSize=100`, { headers: { Cookie: cookie }, cache: "no-store" });
    const listJson = await list.json() as { data: { items: MediaAssetDto[] } };
    for (const id of createdIds) assert(listJson.data.items.some((asset) => asset.id === id), `${id}: absent from canonical list DTO.`);
    console.log(`PASS canonical list contains ${createdIds.length} uploaded assets`);
  } finally {
    for (const id of createdIds) {
      await fetch(`${baseUrl}/api/admin/media/${id}`, { method: "DELETE", headers: { Cookie: cookie } }).catch(() => undefined);
    }
    await prisma.mediaAsset.deleteMany({ where: { id: { in: createdIds } } });
    await prisma.auditLog.deleteMany({
      where: {
        actor: process.env.ADMIN_EMAIL || "admin@aeranailounge.com",
        createdAt: { gte: startedAt },
        entity: { startsWith: "MediaAsset:" },
      },
    });
    for (const url of createdUrls) {
      const response = await fetch(`${baseUrl}${url}`, { cache: "no-store" }).catch(() => null);
      assert(!response || response.status === 404, `${url}: cleanup did not remove storage object.`);
    }
  }
  console.log("PASS upload API integration matrix and cleanup.");
}

main()
  .catch((error) => {
    console.error("FAIL upload API integration", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
