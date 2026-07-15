import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { loadEnvConfig } from "@next/env";
import sharp from "sharp";
import { Prisma } from "@prisma/client";
import { signAdminSession } from "../lib/auth/require-admin";
import { prisma } from "../lib/db";
import { CONTENT_PAGE_KEYS, type ContentPageKey } from "../lib/content/content.types";
import { serializeMediaAsset } from "../lib/media/media-asset.dto";
import { getStorageAdapter } from "../lib/storage";

const baseUrl = process.env.MEDIA_HTTP_BASE_URL || "http://localhost:3010";
const assetId = process.env.MEDIA_HTTP_ASSET_ID;
const assetUrl = process.env.MEDIA_HTTP_ASSET_URL;

loadEnvConfig(process.cwd(), true);

const imagePaths: Record<ContentPageKey, string[]> = {
  home: ["hero", "image"],
  about: ["hero", "image"],
  services: ["hero", "image"],
  gallery: ["hero", "image"],
  packages: ["hero", "image"],
  promotions: ["hero", "image"],
  contact: ["hero", "image"],
  blog: ["hero", "image"],
  global: ["defaultShareImage"],
};

const publicPaths: Record<ContentPageKey, string> = {
  home: "/",
  about: "/about",
  services: "/services",
  gallery: "/gallery",
  packages: "/packages",
  promotions: "/promotions",
  contact: "/contact",
  blog: "/blog",
  global: "/",
};

function setAtPath(source: Record<string, unknown>, path: string[], value: unknown) {
  const clone = structuredClone(source);
  let cursor = clone;
  for (const key of path.slice(0, -1)) {
    cursor[key] = { ...(cursor[key] as Record<string, unknown>) };
    cursor = cursor[key] as Record<string, unknown>;
  }
  cursor[path[path.length - 1]] = value;
  return clone;
}

function getAtPath(source: Record<string, unknown> | null, path: string[]) {
  return path.reduce<unknown>(
    (value, key) => value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined,
    source,
  );
}

async function jsonRequest<T>(path: string, cookie: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
      Cookie: cookie,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });
  const json = await response.json().catch(() => ({}));
  assert.equal(response.ok, true, `${path}: ${response.status} ${JSON.stringify(json)}`);
  return json as T;
}

async function main() {
  assert.equal(Boolean(assetId), Boolean(assetUrl), "MEDIA_HTTP_ASSET_ID and MEDIA_HTTP_ASSET_URL must be supplied together.");
  const adminEmail = process.env.ADMIN_EMAIL || "content-hub-http-integration@local.test";
  const cookie = `aera_admin_session=${signAdminSession({ email: adminEmail, role: "Owner" })}`;

  const storage = getStorageAdapter();
  let fixtureStorageKey: string | null = null;
  let fixtureAssetId: string | null = null;
  let asset;

  if (assetId && assetUrl) {
    asset = await prisma.mediaAsset.findUniqueOrThrow({ where: { id: assetId } });
    assert.equal(asset.url, assetUrl, "The requested MediaAsset URL does not match the database.");
  } else {
    const image = await sharp({
      create: { width: 4, height: 4, channels: 4, background: { r: 184, g: 139, b: 122, alpha: 1 } },
    }).webp().toBuffer();
    fixtureStorageKey = `content-http-integration/${randomUUID()}.webp`;
    const uploaded = await storage.upload(image, fixtureStorageKey, "image/webp");
    if (!await storage.exists(uploaded.storageKey)) {
      await storage.delete(uploaded.storageKey);
      fixtureStorageKey = null;
      throw new Error("HTTP fixture was not persisted to storage.");
    }
    try {
      asset = await prisma.mediaAsset.create({
        data: {
          fileName: uploaded.storageKey,
          originalName: "content-hub-http-integration.png",
          url: uploaded.url,
          storageKey: uploaded.storageKey,
          mimeType: "image/webp",
          originalMimeType: "image/png",
          size: image.length,
          width: 4,
          height: 4,
          alt: "Content Hub HTTP integration image",
          title: "Content Hub HTTP integration image",
          folder: "content-http-integration",
          provider: uploaded.provider,
          uploadedBy: "content-hub-http-integration",
        },
      });
      fixtureAssetId = asset.id;
    } catch (error) {
      await storage.delete(uploaded.storageKey);
      fixtureStorageKey = null;
      throw error;
    }
  }

  const dto = serializeMediaAsset(asset);
  const expectedAssetUrl = dto.url;

  const reference = {
    mediaId: asset.id,
    src: asset.url,
    alt: asset.alt || asset.originalName || "Content Hub HTTP verification image",
    title: asset.title || asset.originalName || null,
  };
  const baselines = new Map<string, Awaited<ReturnType<typeof prisma.sitePageContent.findUniqueOrThrow>>>();
  const startedAt = new Date();

  try {
    for (const pageKey of CONTENT_PAGE_KEYS) {
      const baseline = await prisma.sitePageContent.findUniqueOrThrow({ where: { slug: pageKey } });
      baselines.set(pageKey, baseline);

      const initial = await jsonRequest<{ data: { draftContent: Record<string, unknown>; version: number } }>(
        `/api/admin/content/${pageKey}`,
        cookie,
      );
      const content = setAtPath(initial.data.draftContent, imagePaths[pageKey], reference);
      const saved = await jsonRequest<{ data: { draftContent: Record<string, unknown>; version: number } }>(
        `/api/admin/content/${pageKey}`,
        cookie,
        { method: "PUT", body: JSON.stringify({ content, version: initial.data.version }) },
      );
      assert.deepEqual(getAtPath(saved.data.draftContent, imagePaths[pageKey]), reference, `${pageKey}: PUT canonical draft`);

      const reloaded = await jsonRequest<{ data: { draftContent: Record<string, unknown>; version: number } }>(
        `/api/admin/content/${pageKey}`,
        cookie,
      );
      assert.deepEqual(getAtPath(reloaded.data.draftContent, imagePaths[pageKey]), reference, `${pageKey}: GET canonical draft`);

      await jsonRequest(
        `/api/admin/content/${pageKey}/publish`,
        cookie,
        { method: "POST", body: JSON.stringify({ version: reloaded.data.version }) },
      );
      const published = await jsonRequest<{ data: { draftContent: Record<string, unknown>; publishedContent: Record<string, unknown> } }>(
        `/api/admin/content/${pageKey}`,
        cookie,
      );
      assert.deepEqual(getAtPath(published.data.draftContent, imagePaths[pageKey]), reference, `${pageKey}: published draft`);
      assert.deepEqual(getAtPath(published.data.publishedContent, imagePaths[pageKey]), reference, `${pageKey}: published content`);

      const publicResponse = await fetch(`${baseUrl}${publicPaths[pageKey]}`, {
        headers: { "Cache-Control": "no-cache" },
        cache: "no-store",
      });
      assert.equal(publicResponse.ok, true, `${pageKey}: public route returned ${publicResponse.status}`);
      const html = await publicResponse.text();
      const containsExpectedAsset: boolean = html.includes(expectedAssetUrl) || html.includes(encodeURIComponent(expectedAssetUrl));
      assert.equal(containsExpectedAsset, true, `${pageKey}: rendered HTML does not contain ${expectedAssetUrl}`);
      console.log(`PASS ${pageKey}: PUT -> GET -> publish -> rendered public HTML`);
    }
  } finally {
    for (const [pageKey, baseline] of Array.from(baselines.entries())) {
      await prisma.sitePageContent.update({
        where: { slug: pageKey },
        data: {
          draftContent: baseline.draftContent as Prisma.InputJsonValue,
          publishedContent: baseline.publishedContent as Prisma.InputJsonValue,
          version: baseline.version,
          updatedBy: baseline.updatedBy,
          publishedBy: baseline.publishedBy,
          publishedAt: baseline.publishedAt,
          updatedAt: baseline.updatedAt,
        },
      });
    }
    await prisma.auditLog.deleteMany({
      where: {
        actor: adminEmail,
        createdAt: { gte: startedAt },
        action: { in: ["CONTENT_DRAFT_SAVED", "CONTENT_PUBLISHED"] },
      },
    });
    if (fixtureAssetId) {
      await prisma.mediaAsset.deleteMany({ where: { id: fixtureAssetId } });
    }
    if (fixtureStorageKey) {
      await storage.delete(fixtureStorageKey);
    }
  }
  console.log(`PASS HTTP integration: ${CONTENT_PAGE_KEYS.length} pages rendered and database baselines restored.`);
}

main()
  .catch((error) => {
    console.error("FAIL HTTP integration", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
