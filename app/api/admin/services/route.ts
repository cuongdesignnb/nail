import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serviceSchema } from "@/lib/validations/services.validation";
import { authErrorResponse, requireAdmin } from "@/lib/auth/require-admin";

// Generate slug function
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-"); // Replace multiple - with single -
}

export async function GET(req: NextRequest) {
  try {
    requireAdmin();

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const isActiveStr = searchParams.get("isActive");
    const isFeaturedStr = searchParams.get("isFeatured");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: any = {};

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
        { shortDescription: { contains: keyword, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isActiveStr !== null && isActiveStr !== "") {
      where.isActive = isActiveStr === "true";
    }

    if (isFeaturedStr !== null && isFeaturedStr !== "") {
      where.isFeatured = isFeaturedStr === "true";
    }

    const offset = (page - 1) * limit;

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        orderBy: { sortOrder: "asc" },
        skip: offset,
        take: limit,
        include: { category: true },
      }),
      prisma.service.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: services,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("GET Services Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error", issues: {} }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin();

    const body = await req.json();
    const result = serviceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: result.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    const data = result.data;
    
    // Auto-generate slug if not provided
    const finalSlug = data.slug ? slugify(data.slug) : slugify(data.name);

    // Verify unique slug
    const existing = await prisma.service.findUnique({
      where: { slug: finalSlug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: { slug: ["Slug must be unique"] } },
        { status: 422 }
      );
    }

    // Map compatible legacy fields
    const newService = await prisma.service.create({
      data: {
        categoryId: data.categoryId,
        name: data.name,
        slug: finalSlug,
        shortDescription: data.shortDescription,
        description: data.description,
        price: data.price !== null ? data.price : 0, // compatibility
        priceLabel: data.priceLabel,
        duration: data.durationMinutes !== null ? data.durationMinutes : 30, // compatibility
        durationMinutes: data.durationMinutes,
        durationLabel: data.durationLabel,
        image: data.image,
        imageAlt: data.imageAlt,
        features: data.features,
        isFeatured: data.isFeatured,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      },
    });

    return NextResponse.json({ success: true, data: newService });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("POST Services Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error", issues: {} }, { status: 500 });
  }
}
