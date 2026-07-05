import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { blogPostSchema } from "@/lib/validations/blog.validation";
import { slugify } from "@/lib/slugify";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: { category: true },
    });
    if (!item) {
      return NextResponse.json({ success: false, message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: item });
  } catch (error) {
    console.error("GET admin/blog-posts/[id] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    if (!json.slug && json.title) {
      json.slug = slugify(json.title);
    }
    const body = blogPostSchema.parse(json);

    // unique slug verification
    const exists = await prisma.blogPost.findFirst({
      where: { slug: body.slug || "", NOT: { id: params.id } },
    });
    if (exists) {
      return NextResponse.json(
        { success: false, message: "Article slug already exists" },
        { status: 400 }
      );
    }

    // Publish details logic
    let publishedAt = body.publishedAt ? new Date(body.publishedAt) : null;
    let scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;

    if (body.status === "PUBLISHED" && !publishedAt) {
      publishedAt = new Date();
    }

    const updated = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        categoryId: body.categoryId || null,
        title: body.title,
        slug: body.slug || slugify(body.title),
        excerpt: body.excerpt || null,
        content: body.content || null,
        coverImage: body.coverImage || null,
        coverMediaId: body.coverMediaId || null,
        coverImageAlt: body.coverImageAlt || null,
        authorName: body.authorName || "Aera Team",
        authorAvatar: body.authorAvatar || null,
        authorRole: body.authorRole || null,
        readTimeMinutes: body.readTimeMinutes || null,
        status: body.status,
        isFeatured: body.isFeatured,
        isTrending: body.isTrending,
        isEditorsPick: body.isEditorsPick,
        isPinned: body.isPinned,
        publishedAt,
        scheduledAt,
        seoTitle: body.seoTitle || null,
        seoDescription: body.seoDescription || null,
        seoKeywords: body.seoKeywords || null,
        faqs: (body.faqs as any) || null,
        products: (body.products as any) || null,
        sortOrder: body.sortOrder,
      },
    });

    await prisma.mediaUsage.deleteMany({
      where: { entityType: "BlogPost", entityId: params.id, fieldKey: "coverImage" },
    }).catch(() => undefined);
    if (body.coverMediaId) {
      await prisma.mediaUsage.create({
        data: { mediaId: body.coverMediaId, entityType: "BlogPost", entityId: params.id, fieldKey: "coverImage" },
      }).catch(() => undefined);
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("PUT admin/blog-posts/[id] error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const deleted = await prisma.blogPost.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ success: true, message: "Post deleted successfully", data: deleted });
  } catch (error) {
    console.error("DELETE admin/blog-posts/[id] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
