import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/lib/validations/services.validation";

// TODO: Replace with real admin auth check
async function requireAdmin() {
  return true;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const category = await prisma.serviceCategory.findUnique({
      where: { id: params.id },
    });

    if (!category) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 444 });
    }

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error("GET Category Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Check unique slug (excluding self)
    const existing = await prisma.serviceCategory.findFirst({
      where: {
        slug: result.data.slug,
        NOT: { id: params.id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: { slug: ["Slug is already taken"] } },
        { status: 400 }
      );
    }

    const updated = await prisma.serviceCategory.update({
      where: { id: params.id },
      data: result.data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT Category Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    // Soft delete by setting isActive to false
    const deleted = await prisma.serviceCategory.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Category deactivated successfully", data: deleted });
  } catch (error) {
    console.error("DELETE Category Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
