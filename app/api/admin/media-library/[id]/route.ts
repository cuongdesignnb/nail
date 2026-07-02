import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mediaAssetSchema } from "@/lib/validations/blog.validation";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.mediaAsset.findUnique({
      where: { id: params.id },
    });
    if (!item) {
      return NextResponse.json({ success: false, message: "Asset not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("GET admin/media-library/[id] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    const body = mediaAssetSchema.parse(json);

    const updated = await prisma.mediaAsset.update({
      where: { id: params.id },
      data: {
        fileName: body.fileName,
        originalName: body.originalName || null,
        url: body.url,
        mimeType: body.mimeType || null,
        size: body.size || null,
        width: body.width || null,
        height: body.height || null,
        alt: body.alt || null,
        title: body.title || null,
        folder: body.folder || null,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PUT admin/media-library/[id] error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await prisma.mediaAsset.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Media deleted successfully", data: deleted });
  } catch (error) {
    console.error("DELETE admin/media-library/[id] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
