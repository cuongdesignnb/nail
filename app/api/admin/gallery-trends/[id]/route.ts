import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { trendSchema } from "@/lib/validations/gallery.validation";
import { requireAdminApi } from "@/lib/auth/admin-api";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
  try {
    const trend = await prisma.galleryTrend.findUnique({
      where: { id: params.id },
    });
    if (!trend) {
      return NextResponse.json({ success: false, message: "Trend not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: trend });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
  try {
    const json = await req.json();

    if (json.title && !json.slug) {
      json.slug = json.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const result = trendSchema.safeParse(json);
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

    const existing = await prisma.galleryTrend.findFirst({
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
          errors: { slug: ["Slug already in use by another trend."] },
        },
        { status: 400 }
      );
    }

    const updated = await prisma.galleryTrend.update({
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
    const deactivated = await prisma.galleryTrend.update({
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
