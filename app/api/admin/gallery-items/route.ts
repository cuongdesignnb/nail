import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { galleryItemSchema } from "@/lib/validations/gallery.validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword");
    const categoryId = searchParams.get("categoryId");
    const isActiveStr = searchParams.get("isActive");
    const isHighlightStr = searchParams.get("isHighlight");
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;

    const where: any = {};

    if (keyword) {
      where.OR = [
        { title: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { tag: { contains: keyword, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActiveStr === "true") {
      where.isActive = true;
    } else if (isActiveStr === "false") {
      where.isActive = false;
    }

    if (isHighlightStr === "true") {
      where.isHighlight = true;
    } else if (isHighlightStr === "false") {
      where.isHighlight = false;
    }

    const skip = (page - 1) * limit;

    const [items, total] = await prisma.$transaction([
      prisma.galleryItem.findMany({
        where,
        orderBy: { sortOrder: "asc" },
        skip,
        take: limit,
        include: { category: true },
      }),
      prisma.galleryItem.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages,
      },
    });
  } catch (error) {
    console.error("GET Admin Gallery Items Error:", error);
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

    // Check slug uniqueness
    const existing = await prisma.galleryItem.findUnique({
      where: { slug: result.data.slug || "" },
    });
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: { slug: ["Gallery item slug already exists."] },
        },
        { status: 400 }
      );
    }

    const created = await prisma.galleryItem.create({
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

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("POST Admin Gallery Item Error:", error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}
