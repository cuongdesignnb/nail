import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { blogCategorySchema } from "@/lib/validations/blog.validation";
import { slugify } from "@/lib/slugify";
import { BlogPostStatus } from "@prisma/client";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.blogCategory.findUnique({
      where: { id: params.id },
    });
    if (!item) {
      return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("GET admin/blog-categories/[id] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    if (!json.slug && json.name) {
      json.slug = slugify(json.name);
    }
    const body = blogCategorySchema.parse(json);

    // unique slug verification
    const exists = await prisma.blogCategory.findFirst({
      where: { slug: body.slug || "", NOT: { id: params.id } },
    });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Category slug already exists" },
        { status: 400 }
      );
    }

    const updated = await prisma.blogCategory.update({
      where: { id: params.id },
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

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PUT admin/blog-categories/[id] error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check if there are active posts in this category
    const activePostsCount = await prisma.blogPost.count({
      where: {
        categoryId: params.id,
        status: BlogPostStatus.PUBLISHED,
      },
    });

    if (activePostsCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Cannot hard delete category: It contains active published blog posts. Try soft-disabling it instead.",
        },
        { status: 400 }
      );
    }

    // Soft delete by marking isActive = false
    const softDeleted = await prisma.blogCategory.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Category soft deleted", data: softDeleted });
  } catch (error) {
    console.error("DELETE admin/blog-categories/[id] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
