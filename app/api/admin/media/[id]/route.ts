import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { mediaUpdateSchema } from "@/lib/validations/media.schema";
import { getStorageAdapter } from "@/lib/storage";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();

    const asset = await prisma.mediaAsset.findUnique({
      where: { id: params.id },
    });

    if (!asset || asset.isDeleted) {
      return NextResponse.json(
        { success: false, error: "Asset not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: asset });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error("GET /api/admin/media/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();

    const json = await req.json();
    const body = mediaUpdateSchema.parse(json);

    const existing = await prisma.mediaAsset.findUnique({
      where: { id: params.id },
    });

    if (!existing || existing.isDeleted) {
      return NextResponse.json(
        { success: false, error: "Asset not found" },
        { status: 404 }
      );
    }

    const updated = await prisma.mediaAsset.update({
      where: { id: params.id },
      data: {
        alt: body.alt !== undefined ? body.alt : existing.alt,
        title: body.title !== undefined ? body.title : existing.title,
        folder: body.folder !== undefined ? body.folder : existing.folder,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error("PUT /api/admin/media/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();

    const existing = await prisma.mediaAsset.findUnique({
      where: { id: params.id },
    });

    if (!existing || existing.isDeleted) {
      return NextResponse.json(
        { success: false, error: "Asset not found" },
        { status: 404 }
      );
    }

    // Soft delete
    const deleted = await prisma.mediaAsset.update({
      where: { id: params.id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });

    // Optionally remove from storage
    if (existing.storageKey && existing.provider !== "external") {
      try {
        const storage = getStorageAdapter();
        await storage.delete(existing.storageKey);
      } catch (storageErr) {
        console.warn("Failed to remove file from storage:", storageErr);
      }
    }

    return NextResponse.json({
      success: true,
      data: deleted,
    });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error("DELETE /api/admin/media/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
