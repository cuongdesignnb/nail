import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { mediaAssetSchema } from "@/lib/validations/blog.validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") || undefined;
    const folder = searchParams.get("folder") || undefined;

    const filter: any = {};
    if (folder) filter.folder = folder;
    if (keyword) {
      filter.OR = [
        { fileName: { contains: keyword, mode: "insensitive" } },
        { title: { contains: keyword, mode: "insensitive" } },
        { alt: { contains: keyword, mode: "insensitive" } },
      ];
    }

    const list = await prisma.mediaAsset.findMany({
      where: filter,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    console.error("GET admin/media-library error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = mediaAssetSchema.parse(json);

    const item = await prisma.mediaAsset.create({
      data: {
        fileName: body.fileName,
        originalName: body.originalName || body.fileName,
        url: body.url,
        mimeType: body.mimeType || "image/jpeg",
        size: body.size || 0,
        width: body.width || 0,
        height: body.height || 0,
        alt: body.alt || null,
        title: body.title || null,
        folder: body.folder || "uploads",
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error("POST admin/media-library error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
