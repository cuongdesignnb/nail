import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { galleryItemSchema } from "@/lib/validations/gallery.validation";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.galleryItem.findUnique({
      where: { id: params.id },
      include: { category: true },
    });
    if (!item) {
      return NextResponse.json({ success: false, message: "Gallery item not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();

    if (json.title && !json.slug) {
      json.slug = json.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const result = galleryItemSchema.safeParse(json);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    // Check unique slug (excluding self)
    const existing = await prisma.galleryItem.findFirst({
      where: {
        slug: result.data.slug || "",
        NOT: { id: params.id },
      },
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: { slug: ["Slug already in use by another gallery item."] },
        },
        { status: 400 }
      );
    }

    const updated = await prisma.galleryItem.update({
      where: { id: params.id },
      data: {
        categoryId: result.data.categoryId || null,
        title: result.data.title,
        slug: result.data.slug || "",
        description: result.data.description || null,
        image: result.data.image,
        imageAlt: result.data.imageAlt || null,
        tag: result.data.tag || null,
        isHighlight: result.data.isHighlight,
        isActive: result.data.isActive,
        sortOrder: result.data.sortOrder,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deactivated = await prisma.galleryItem.update({
      where: { id: params.id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true, data: deactivated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}
