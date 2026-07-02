import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/lib/validations/services.validation";

// TODO: Replace with real admin auth check (e.g., NextAuth getServerSession)
async function requireAdmin() {
  return true;
}

export async function GET() {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const categories = await prisma.serviceCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("GET Categories Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = categorySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Check unique slug
    const existing = await prisma.serviceCategory.findUnique({
      where: { slug: result.data.slug },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: { slug: ["Slug must be unique"] } },
        { status: 400 }
      );
    }

    const category = await prisma.serviceCategory.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("POST Categories Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
