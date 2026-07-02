import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { serviceSchema } from "@/lib/validations/services.validation";

// TODO: Replace with real admin auth check
async function requireAdmin() {
  return true;
}

// Generate slug function
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!service) {
      return NextResponse.json({ success: false, message: "Service not found" }, { status: 444 });
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    console.error("GET Service Error:", error);
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
    const result = serviceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = result.data;
    
    // Auto-generate slug if not provided
    const finalSlug = data.slug ? slugify(data.slug) : slugify(data.name);

    // Verify unique slug (excluding self)
    const existing = await prisma.service.findFirst({
      where: {
        slug: finalSlug,
        NOT: { id: params.id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: { slug: ["Slug is already taken"] } },
        { status: 400 }
      );
    }

    const updated = await prisma.service.update({
      where: { id: params.id },
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

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT Service Error:", error);
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
    const deactivated = await prisma.service.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Service deactivated successfully", data: deactivated });
  } catch (error) {
    console.error("DELETE Service Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
