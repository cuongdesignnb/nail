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

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.nailPackage.findUnique({
      where: { id: params.id },
      include: { category: true },
    });
    if (!item) {
      return NextResponse.json({ success: false, message: "Package not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    if (!json.slug && json.name) {
      json.slug = makeSlug(json.name);
    }
    const body = nailPackageSchema.parse(json);

    // unique slug verification
    const duplicate = await prisma.nailPackage.findFirst({
      where: { slug: body.slug || "", NOT: { id: params.id } },
    });
    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "Package slug already exists" },
        { status: 400 }
      );
    }

    const updated = await prisma.nailPackage.update({
      where: { id: params.id },
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

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PUT nail-packages/[id] error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.nailPackage.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Package deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
