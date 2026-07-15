export const runtime = "nodejs";

import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { getStorageAdapter } from "@/lib/storage";
import { optimizeToWebp } from "@/lib/media/image-processor";
import {
  MAX_UPLOAD_SIZE,
  validateUploadedImage,
} from "@/lib/media/image-validation";
import { normalizeMediaFolder } from "@/lib/media/media-folders";
import { serializeMediaAsset } from "@/lib/media/media-asset.dto";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

type MediaUploadErrorCode =
  | "MEDIA_FILE_REQUIRED"
  | "MEDIA_FILE_TOO_LARGE"
  | "MEDIA_TYPE_UNSUPPORTED"
  | "MEDIA_PROCESSING_FAILED"
  | "MEDIA_STORAGE_FAILED"
  | "MEDIA_STORAGE_VERIFICATION_FAILED"
  | "MEDIA_DATABASE_FAILED"
  | "MEDIA_UPLOAD_FAILED";

class MediaUploadError extends Error {
  constructor(
    readonly code: MediaUploadErrorCode,
    message: string,
    readonly status = 500,
    readonly detail?: string,
  ) {
    super(message);
  }
}

function errorResponse(error: MediaUploadError) {
  return NextResponse.json(
    {
      success: false,
      error: error.message,
      code: error.code,
      detail: error.detail,
    },
    { status: error.status },
  );
}

export async function POST(req: Request) {
  let actor: ReturnType<typeof requireAdmin>;
  try {
    actor = requireAdmin();
  } catch (error) {
    const response = authErrorResponse(error);
    if (response) return response;
    return errorResponse(new MediaUploadError("MEDIA_UPLOAD_FAILED", "Unauthorized.", 401));
  }

  const storage = getStorageAdapter();
  let uploadedStorageKey: string | null = null;

  try {
    const formData = await req.formData();
    const entry = formData.get("file");
    if (!entry || typeof entry === "string" || typeof entry.arrayBuffer !== "function") {
      throw new MediaUploadError(
        "MEDIA_FILE_REQUIRED",
        "Select an image to upload.",
        400,
      );
    }

    const file = entry as File;
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > MAX_UPLOAD_SIZE) {
      throw new MediaUploadError(
        "MEDIA_FILE_TOO_LARGE",
        "The image exceeds the 10 MB upload limit.",
        413,
      );
    }

    const validation = validateUploadedImage(buffer, file.name, file.type);
    if (!validation.valid) {
      throw new MediaUploadError(
        "MEDIA_TYPE_UNSUPPORTED",
        "Upload a valid JPEG, PNG, WebP, or AVIF image.",
        400,
        validation.error,
      );
    }

    let processed: Awaited<ReturnType<typeof optimizeToWebp>>;
    try {
      processed = await optimizeToWebp(buffer);
    } catch (error) {
      throw new MediaUploadError(
        "MEDIA_PROCESSING_FAILED",
        "Unable to process the image.",
        422,
        error instanceof Error ? error.message : undefined,
      );
    }

    const folder = normalizeMediaFolder(formData.get("folder"));
    const requestedStorageKey = `${folder}/${randomUUID()}.webp`;
    let uploadResult: Awaited<ReturnType<typeof storage.upload>>;
    try {
      uploadResult = await storage.upload(
        processed.buffer,
        requestedStorageKey,
        "image/webp",
      );
      uploadedStorageKey = uploadResult.storageKey;
    } catch (error) {
      throw new MediaUploadError(
        "MEDIA_STORAGE_FAILED",
        "Unable to store the uploaded image.",
        500,
        error instanceof Error ? error.message : undefined,
      );
    }

    let stored = false;
    try {
      stored = await storage.exists(uploadResult.storageKey);
    } catch (error) {
      throw new MediaUploadError(
        "MEDIA_STORAGE_VERIFICATION_FAILED",
        "The uploaded image could not be verified in storage.",
        500,
        error instanceof Error ? error.message : undefined,
      );
    }
    if (!stored) {
      throw new MediaUploadError(
        "MEDIA_STORAGE_VERIFICATION_FAILED",
        "The uploaded image could not be verified in storage.",
        500,
      );
    }

    const alt = String(formData.get("alt") || "").trim();
    const title = String(formData.get("title") || "").trim();
    const folderId = String(formData.get("folderId") || "").trim() || null;

    let asset;
    try {
      asset = await prisma.mediaAsset.create({
        data: {
          fileName: uploadResult.storageKey,
          originalName: file.name,
          url: normalizeMediaUrl(uploadResult.url),
          storageKey: uploadResult.storageKey,
          mimeType: "image/webp",
          originalMimeType: validation.detectedType,
          size: processed.size,
          width: processed.width,
          height: processed.height,
          alt,
          title,
          folder,
          folderId,
          provider: uploadResult.provider || "local",
          uploadedBy: actor.email,
        },
      });
    } catch (error) {
      throw new MediaUploadError(
        "MEDIA_DATABASE_FAILED",
        "Unable to save the uploaded image record.",
        500,
        error instanceof Error ? error.message : undefined,
      );
    }

    uploadedStorageKey = null;
    try {
      await prisma.auditLog.create({
        data: {
          actor: actor.email,
          action: "MEDIA_CREATED",
          entity: `MediaAsset:${asset.id}`,
          entityType: "MediaAsset",
          entityId: asset.id,
          performedBy: actor.email,
          details: {
            originalName: file.name,
            originalMimeType: validation.detectedType,
            storageKey: uploadResult.storageKey,
            convertedTo: "image/webp",
            size: processed.size,
            width: processed.width,
            height: processed.height,
          },
        },
      });
    } catch (error) {
      console.warn("[media/upload] Asset saved but audit logging failed", {
        assetId: asset.id,
        error: error instanceof Error ? error.message : String(error),
      });
    }

    return NextResponse.json({ success: true, data: serializeMediaAsset(asset) });
  } catch (error) {
    if (uploadedStorageKey) {
      try {
        await storage.delete(uploadedStorageKey);
      } catch (cleanupError) {
        console.error("[media/upload] Failed to clean up storage after upload error", {
          storageKey: uploadedStorageKey,
          error: cleanupError instanceof Error ? cleanupError.message : String(cleanupError),
        });
      }
    }

    const uploadError =
      error instanceof MediaUploadError
        ? error
        : new MediaUploadError(
            "MEDIA_UPLOAD_FAILED",
            "Unable to upload image.",
            500,
            error instanceof Error ? error.message : undefined,
          );
    console.error("[media/upload] Upload failed", {
      code: uploadError.code,
      detail: uploadError.detail,
    });
    return errorResponse(uploadError);
  }
}
