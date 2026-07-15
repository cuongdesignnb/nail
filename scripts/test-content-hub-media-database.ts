import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { Prisma } from "@prisma/client";
import { prisma } from "../lib/db";
import { CONTENT_PAGE_KEYS, type ContentPageKey } from "../lib/content/content.types";
import { getPageContent, getPublishedContent, publishContent, saveDraftContent } from "../lib/content/content.repository";
import { getStorageAdapter } from "../lib/storage";
import { serializeMediaAsset } from "../lib/media/media-asset.dto";

const actor = `content-hub-media-integration-${randomUUID()}`;
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

function setAtPath(source: Record<string, unknown>, path: string[], value: unknown) {
  const clone = structuredClone(source);
  let cursor = clone;
  path.slice(0, -1).forEach((key) => {
    cursor[key] = { ...(cursor[key] as Record<string, unknown>) };
    cursor = cursor[key] as Record<string, unknown>;
  });
  cursor[path[path.length - 1]] = value;
  return clone;
}

function getAtPath(source: Record<string, unknown> | null, path: string[]) {
  return path.reduce<unknown>((value, key) => value && typeof value === "object" ? (value as Record<string, unknown>)[key] : undefined, source);
}

async function main() {
  const storage = getStorageAdapter();
  const storageKey = `content-integration/${randomUUID()}.webp`;
  const image = await sharp({ create: { width: 4, height: 4, channels: 4, background: { r: 184, g: 139, b: 122, alpha: 1 } } }).webp().toBuffer();
  const uploaded = await storage.upload(image, storageKey, "image/webp");
  assert.equal(await storage.exists(uploaded.storageKey), true);
  const asset = await prisma.mediaAsset.create({
    data: {
      fileName: uploaded.storageKey,
      originalName: "content-hub-integration.png",
      url: uploaded.url,
      storageKey: uploaded.storageKey,
      mimeType: "image/webp",
      originalMimeType: "image/png",
      size: image.length,
      width: 4,
      height: 4,
      alt: "Content Hub integration image",
      title: "Content Hub integration image",
      folder: "content-integration",
      provider: uploaded.provider,
      uploadedBy: actor,
    },
  });
  const dto = serializeMediaAsset(asset);
  const reference = { mediaId: dto.id, src: dto.url, alt: dto.alt || "Content Hub integration image", title: dto.title };
  const baselines = new Map<string, Awaited<ReturnType<typeof prisma.sitePageContent.findUniqueOrThrow>>>();

  try {
    for (const pageKey of CONTENT_PAGE_KEYS) {
      await getPageContent(pageKey);
      const baseline = await prisma.sitePageContent.findUniqueOrThrow({ where: { slug: pageKey } });
      baselines.set(pageKey, baseline);
      const data = await getPageContent(pageKey);
      const submitted = setAtPath(data.draftContent, imagePaths[pageKey], reference);
      await saveDraftContent({ pageKey, content: submitted, version: data.version, actor });
      const reloaded = await getPageContent(pageKey);
      assert.deepEqual(getAtPath(reloaded.draftContent, imagePaths[pageKey]), reference, `${pageKey} draft reload`);
      await publishContent({ pageKey, version: reloaded.version, actor });
      const publishedData = await getPageContent(pageKey);
      assert.deepEqual(getAtPath(publishedData.publishedContent, imagePaths[pageKey]), reference, `${pageKey} published reload`);
      const publicContent = await getPublishedContent(pageKey);
      assert.deepEqual(getAtPath(publicContent, imagePaths[pageKey]), reference, `${pageKey} public content`);
      console.log(`PASS ${pageKey}: save -> reload -> publish -> public image equality`);
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
    await prisma.auditLog.deleteMany({ where: { actor } });
    await prisma.mediaAsset.deleteMany({ where: { id: asset.id } });
    await storage.delete(uploaded.storageKey);
  }
  console.log(`PASS database integration: ${CONTENT_PAGE_KEYS.length} Content Hub pages verified and restored.`);
}

main()
  .catch((error) => {
    console.error("FAIL database integration", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
