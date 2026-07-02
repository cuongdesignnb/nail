import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { collectionSchema } from "@/lib/validations/gallery.validation";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const col = await prisma.galleryCollection.findUnique({
      where: { id: params.id },
    });
    if (!col) {
      return NextResponse.json({ success: false, message: "Collection not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: col });
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

    const result = collectionSchema.safeParse(json);
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

    const existing = await prisma.galleryCollection.findFirst({
      where: {
        slug: result.data.slug,
        NOT: { id: params.id },
      },
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: { slug: ["Slug already in use by another collection."] },
        },
        { status: 400 }
      );
    }

    const updated = await prisma.galleryCollection.update({
      where: { id: params.id },
      data: result.data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deactivated = await prisma.galleryCollection.update({
      where: { id: params.id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true, data: deactivated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}
