import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { packageCategorySchema } from "@/lib/validations/packages.validation";

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

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    if (!json.slug && json.name) {
      json.slug = makeSlug(json.name);
    }
    const body = packageCategorySchema.parse(json);

    // check uniqueness for other records
    const duplicate = await prisma.packageCategory.findFirst({
      where: { slug: body.slug, NOT: { id: params.id } },
    });
    if (duplicate) {
      return NextResponse.json(
        { success: false, message: "Category slug already exists" },
        { status: 400 }
      );
    }

    const updated = await prisma.packageCategory.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check if packages are tied to category
    const hasPackages = await prisma.nailPackage.findFirst({
      where: { categoryId: params.id },
    });
    if (hasPackages) {
      // Soft-delete category by marking inactive
      await prisma.packageCategory.update({
        where: { id: params.id },
        data: { isActive: false },
      });
      return NextResponse.json({
        success: true,
        message: "Category contains active packages, marked as inactive instead",
      });
    }

    await prisma.packageCategory.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Category deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
