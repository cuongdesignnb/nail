import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { trendSchema } from "@/lib/validations/gallery.validation";

export async function GET() {
  try {
    const trends = await prisma.galleryTrend.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: trends });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Database query failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const existing = await prisma.galleryTrend.findUnique({
      where: { slug: result.data.slug },
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: { slug: ["Trend slug already exists."] },
        },
        { status: 400 }
      );
    }

    const created = await prisma.galleryTrend.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}
