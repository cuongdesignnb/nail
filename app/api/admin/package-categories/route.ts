import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { packageCategorySchema } from "@/lib/validations/packages.validation";

// Note: If slugify does not exist in utils, we can define a fallback
const toSlug = (text: string) => {
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

export async function GET() {
  try {
    const list = await prisma.packageCategory.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    if (!json.slug && json.name) {
      json.slug = toSlug(json.name);
    }
    const body = packageCategorySchema.parse(json);

    // check uniqueness
    const exists = await prisma.packageCategory.findUnique({
      where: { slug: body.slug },
    });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Category slug already exists" },
        { status: 400 }
      );
    }

    const item = await prisma.packageCategory.create({ data: body });
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
