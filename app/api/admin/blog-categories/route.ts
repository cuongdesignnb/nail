import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { blogCategorySchema } from "@/lib/validations/blog.validation";
import { slugify } from "@/lib/slugify";

export async function GET() {
  try {
    const list = await prisma.blogCategory.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    const data = list.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      imageAlt: c.imageAlt,
      icon: c.icon,
      sortOrder: c.sortOrder,
      isActive: c.isActive,
      postCount: c._count.posts,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET admin/blog-categories error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    if (!json.slug && json.name) {
      json.slug = slugify(json.name);
    }
    const body = blogCategorySchema.parse(json);

    // slug unique validation
    const exists = await prisma.blogCategory.findUnique({
      where: { slug: body.slug || "" },
    });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Category slug already exists" },
        { status: 400 }
      );
    }

    const item = await prisma.blogCategory.create({
      data: {
        name: body.name,
        slug: body.slug || slugify(body.name),
        description: body.description || null,
        image: body.image || null,
        imageAlt: body.imageAlt || null,
        icon: body.icon || null,
        sortOrder: body.sortOrder,
        isActive: body.isActive,
      },
    });

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error("POST admin/blog-categories error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
