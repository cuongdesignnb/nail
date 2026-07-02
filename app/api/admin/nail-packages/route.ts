import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { nailPackageSchema } from "@/lib/validations/packages.validation";

const makeSlug = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") || "";
    const categoryId = searchParams.get("categoryId") || "";
    const isActiveStr = searchParams.get("isActive") || "";
    const isPopularStr = searchParams.get("isPopular") || "";
    const isFeaturedStr = searchParams.get("isFeatured") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (keyword) {
      whereClause.OR = [
        { name: { contains: keyword, mode: "insensitive" } },
        { subtitle: { contains: keyword, mode: "insensitive" } },
        { description: { contains: keyword, mode: "insensitive" } },
      ];
    }
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    if (isActiveStr) {
      whereClause.isActive = isActiveStr === "true";
    }
    if (isPopularStr) {
      whereClause.isPopular = isPopularStr === "true";
    }
    if (isFeaturedStr) {
      whereClause.isFeatured = isFeaturedStr === "true";
    }

    const total = await prisma.nailPackage.count({ where: whereClause });
    const list = await prisma.nailPackage.findMany({
      where: whereClause,
      orderBy: { sortOrder: "asc" },
      skip,
      take: limit,
      include: { category: true },
    });

    return NextResponse.json({
      success: true,
      data: list,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET nail-packages error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    if (!json.slug && json.name) {
      json.slug = makeSlug(json.name);
    }
    const body = nailPackageSchema.parse(json);

    // unique slug validation
    const exists = await prisma.nailPackage.findUnique({
      where: { slug: body.slug || "" },
    });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Package slug already exists" },
        { status: 400 }
      );
    }

    const item = await prisma.nailPackage.create({
      data: {
        categoryId: body.categoryId || null,
        name: body.name,
        slug: body.slug || makeSlug(body.name),
        subtitle: body.subtitle || null,
        shortDescription: body.shortDescription || null,
        description: body.description || null,
        image: body.image || null,
        imageAlt: body.imageAlt || null,
        price: body.price || null,
        priceLabel: body.priceLabel || null,
        durationLabel: body.durationLabel || null,
        visitCountLabel: body.visitCountLabel || null,
        badge: body.badge || null,
        features: body.features || [],
        isPopular: body.isPopular,
        isFeatured: body.isFeatured,
        isActive: body.isActive,
        sortOrder: body.sortOrder,
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error("POST nail-packages error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
