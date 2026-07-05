import { randomUUID } from "crypto";
import { prisma } from "@/lib/db";
import { optimizeToWebp } from "@/lib/media/image-processor";
import { getStorageAdapter } from "@/lib/storage";

export async function saveAiImageToMediaLibrary(input: {
  buffer: Buffer;
  jobId: string;
  keyword: string;
  alt: string;
  promptSummary: string;
}) {
  const processed = await optimizeToWebp(input.buffer);
  const storageKey = `ai-blog/${randomUUID()}.webp`;
  const storage = getStorageAdapter();
  const result = await storage.upload(processed.buffer, storageKey, "image/webp");

  const asset = await prisma.mediaAsset.create({
    data: {
      fileName: storageKey,
      originalName: `${input.keyword}.png`,
      url: result.url,
      storageKey: result.storageKey,
      mimeType: "image/webp",
      originalMimeType: "image/png",
      size: processed.size,
      width: processed.width,
      height: processed.height,
      alt: input.alt,
      title: input.keyword,
      folder: "blog",
      provider: "ai_generated",
      uploadedBy: "ai-content",
    },
  });

  await prisma.mediaUsage.create({
    data: {
      mediaId: asset.id,
      entityType: "AiContentJob",
      entityId: input.jobId,
      fieldKey: "coverImage",
    },
  }).catch(() => undefined);

  await prisma.auditLog.create({
    data: {
      actor: "ai-content",
      action: "AI_IMAGE_GENERATED",
      entity: `AiContentJob:${input.jobId}`,
      entityType: "AiContentJob",
      entityId: input.jobId,
      details: { mediaId: asset.id, promptSummary: input.promptSummary.slice(0, 400) },
    },
  }).catch(() => undefined);

  return asset;
}
