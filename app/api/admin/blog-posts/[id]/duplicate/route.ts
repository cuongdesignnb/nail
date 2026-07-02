import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BlogPostStatus } from "@prisma/client";
import { slugify } from "@/lib/slugify";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const original = await prisma.blogPost.findUnique({
      where: { id: params.id },
    });

    if (!original) {
      return NextResponse.json({ success: false, message: "Original article not found" }, { status: 404 });
    }

    const title = `${original.title} Copy`;
    let slug = slugify(title);

    // Ensure unique slug
    let index = 1;
    let exists = await prisma.blogPost.findUnique({ where: { slug } });
    while (exists) {
      slug = `${slugify(title)}-${index}`;
      exists = await prisma.blogPost.findUnique({ where: { slug } });
      index++;
    }

    const duplicated = await prisma.blogPost.create({
      data: {
        categoryId: original.categoryId,
        title,
        slug,
        excerpt: original.excerpt,
        content: original.content,
        coverImage: original.coverImage,
        coverImageAlt: original.coverImageAlt,
        authorName: original.authorName,
        authorAvatar: original.authorAvatar,
        authorRole: original.authorRole,
        readTimeMinutes: original.readTimeMinutes,
        status: BlogPostStatus.DRAFT,
        isFeatured: false,
        isTrending: false,
        isEditorsPick: false,
        isPinned: false,
        publishedAt: null,
        scheduledAt: null,
        seoTitle: original.seoTitle,
        seoDescription: original.seoDescription,
        seoKeywords: original.seoKeywords,
        sortOrder: original.sortOrder,
      },
    });

    return NextResponse.json({ success: true, message: "Duplicated successfully", data: duplicated });
  } catch (error) {
    console.error("POST admin/blog-posts/[id]/duplicate error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
