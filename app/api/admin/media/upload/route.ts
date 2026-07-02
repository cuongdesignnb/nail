import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { getStorageAdapter } from "@/lib/storage";
import {
  validateFileType,
  validateFileSize,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
} from "@/lib/validations/media.schema";

export async function POST(req: Request) {
  try {
    const admin = requireAdmin();

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 }
      );
    }

    if (!validateFileType(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (!validateFileSize(file.size)) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storage = getStorageAdapter();
    const result = await storage.upload(buffer, file.name, file.type);

    const folder = (formData.get("folder") as string) || "uploads";
    const alt = (formData.get("alt") as string) || "";
    const title = (formData.get("title") as string) || "";

    const asset = await prisma.mediaAsset.create({
      data: {
        fileName: result.storageKey,
        originalName: file.name,
        url: result.url,
        mimeType: result.mimeType,
        size: result.size,
        alt: alt || null,
        title: title || null,
        folder,
        storageKey: result.storageKey,
        provider: result.provider,
        uploadedBy: admin.email,
      },
    });

    return NextResponse.json({ success: true, data: asset }, { status: 201 });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error("POST /api/admin/media/upload error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
