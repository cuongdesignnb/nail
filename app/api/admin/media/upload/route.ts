// ---------------------------------------------------------------------------
// Media upload API — WebP auto-conversion
// ---------------------------------------------------------------------------

export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { getStorageAdapter } from "@/lib/storage";
import { optimizeToWebp } from "@/lib/media/image-processor";
import { validateUploadedImage } from "@/lib/media/image-validation";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // ── Validate using magic bytes ──────────────────────────
    const validation = validateUploadedImage(buffer, file.name, file.type);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // ── Convert to WebP ─────────────────────────────────────
    const processed = await optimizeToWebp(buffer);

    // ── Build storage key ───────────────────────────────────
    const folderSlug = (formData.get("folder") as string) || "uploads";
    const uuid = randomUUID();
    const storageKey = `${folderSlug}/${uuid}.webp`;

    // ── Upload to storage ───────────────────────────────────
    const storage = getStorageAdapter();
    const result = await storage.upload(processed.buffer, storageKey, "image/webp");

    // ── Persist to database ─────────────────────────────────
    const alt = (formData.get("alt") as string) || "";
    const title = (formData.get("title") as string) || "";
    const folderId = (formData.get("folderId") as string) || null;

    const { normalizeMediaUrl } = await import("@/lib/media/resolve-media");
    const assetUrl = normalizeMediaUrl(result.url);

    const asset = await prisma.mediaAsset.create({
      data: {
        fileName: storageKey,
        originalName: file.name,
        url: assetUrl,
        storageKey: result.storageKey,
        mimeType: "image/webp",
        originalMimeType: validation.detectedType,
        size: processed.size,
        width: processed.width,
        height: processed.height,
        alt,
        title,
        folder: folderSlug,
        folderId,
        provider: result.provider ?? "local",
        uploadedBy: "admin",
      },
    });

    // ── Audit log ───────────────────────────────────────────
    await prisma.auditLog.create({
      data: {
        actor: "admin",
        action: "MEDIA_CREATED",
        entity: `MediaAsset:${asset.id}`,
        entityType: "MediaAsset",
        entityId: asset.id,
        performedBy: "admin",
        details: {
          originalName: file.name,
          originalMimeType: validation.detectedType,
          convertedTo: "image/webp",
          size: processed.size,
          width: processed.width,
          height: processed.height,
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: asset.id,
        url: asset.url,
        storageKey: asset.storageKey,
        mimeType: "image/webp",
        originalName: file.name,
        originalMimeType: validation.detectedType,
        width: processed.width,
        height: processed.height,
        size: processed.size,
        alt: asset.alt,
        title: asset.title,
      },
    });
  } catch (error) {
    console.error("[media/upload] Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to upload file",
        message:
          process.env.NODE_ENV === "development" && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 }
    );
  }
}
