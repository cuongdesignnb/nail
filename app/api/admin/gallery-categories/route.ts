import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/lib/validations/gallery.validation";
import { requireAdminApi } from "@/lib/auth/admin-api";

export async function GET() {
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
  try {
    const categories = await prisma.galleryCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Database query failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
  try {
    const json = await req.json();
    
    // Auto-generate slug from name if empty
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

    // Check slug uniqueness
    const existing = await prisma.galleryCategory.findUnique({
      where: { slug: result.data.slug },
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: { slug: ["Category slug already exists. Please choose a different slug."] },
        },
        { status: 400 }
      );
    }

    const created = await prisma.galleryCategory.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}
