import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/lib/validations/services.validation";
import { authErrorResponse, requireAdmin } from "@/lib/auth/require-admin";

export async function GET() {
  try {
    requireAdmin();

    const categories = await prisma.serviceCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    });

    return NextResponse.json({ success: true, data: categories, meta: {} });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("GET Categories Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error", issues: {} }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin();

    const body = await req.json();
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: result.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    // Check unique slug
    const existing = await prisma.serviceCategory.findUnique({
      where: { slug: result.data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: { slug: ["Slug must be unique"] } },
        { status: 422 }
      );
    }

    const category = await prisma.serviceCategory.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, data: category, meta: {} });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("POST Categories Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error", issues: {} }, { status: 500 });
  }
}
