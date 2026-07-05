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
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin();

    const service = await prisma.service.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!service) {
      return NextResponse.json({ success: false, error: "Service not found", issues: {} }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: service });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("GET Service Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error", issues: {} }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Verify unique slug (excluding self)
    const existing = await prisma.service.findFirst({
      where: {
        slug: finalSlug,
        NOT: { id: params.id },
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "Validation failed", issues: { slug: ["Slug is already taken"] } },
        { status: 422 }
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
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("PUT Service Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error", issues: {} }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin();

    // Soft delete by setting isActive to false
    const deactivated = await prisma.service.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, data: deactivated, meta: {} });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("DELETE Service Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error", issues: {} }, { status: 500 });
  }
}
