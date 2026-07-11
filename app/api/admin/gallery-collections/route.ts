import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { collectionSchema } from "@/lib/validations/gallery.validation";
import { requireAdminApi } from "@/lib/auth/admin-api";

export async function GET() {
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
  try {
    const collections = await prisma.galleryCollection.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: collections });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Database query failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
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

    const existing = await prisma.galleryCollection.findUnique({
      where: { slug: result.data.slug },
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: { slug: ["Collection slug already exists."] },
        },
        { status: 400 }
      );
    }

    const created = await prisma.galleryCollection.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}
