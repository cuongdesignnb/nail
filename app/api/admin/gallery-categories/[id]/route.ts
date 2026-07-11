import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/lib/validations/gallery.validation";
import { requireAdminApi } from "@/lib/auth/admin-api";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
  try {
    const category = await prisma.galleryCategory.findUnique({
      where: { id: params.id },
    });
    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
  try {
    const json = await req.json();

    if (json.name && !json.slug) {
      json.slug = json.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const result = categorySchema.safeParse(json);
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
    const existing = await prisma.galleryCategory.findFirst({
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
          errors: { slug: ["Slug already in use by another category."] },
        },
        { status: 400 }
      );
    }

    const updated = await prisma.galleryCategory.update({
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
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
  try {
    // Soft delete: turn active flag off
    const deactivated = await prisma.galleryCategory.update({
      where: { id: params.id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true, data: deactivated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}

export const PATCH = PUT;
