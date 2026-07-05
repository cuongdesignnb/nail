import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { blogPostSchema } from "@/lib/validations/blog.validation";
import { slugify } from "@/lib/slugify";
import { BlogPostStatus } from "@prisma/client";
import { publishDueScheduledPosts } from "@/services/blog-page.service";

export async function GET(req: Request) {
  try {
    // Process scheduled posts
    await publishDueScheduledPosts();

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("keyword") || undefined;
    const categoryId = searchParams.get("categoryId") || undefined;
    const status = searchParams.get("status") || undefined;
    const isFeatured = searchParams.get("isFeatured") === "true" ? true : undefined;
    const isTrending = searchParams.get("isTrending") === "true" ? true : undefined;
    const isEditorsPick = searchParams.get("isEditorsPick") === "true" ? true : undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};

    if (categoryId) filter.categoryId = categoryId;
    if (status) filter.status = status as BlogPostStatus;
    if (isFeatured !== undefined) filter.isFeatured = isFeatured;
    if (isTrending !== undefined) filter.isTrending = isTrending;
    if (isEditorsPick !== undefined) filter.isEditorsPick = isEditorsPick;

    if (keyword) {
      filter.OR = [
        { title: { contains: keyword, mode: "insensitive" } },
        { excerpt: { contains: keyword, mode: "insensitive" } },
        { content: { contains: keyword, mode: "insensitive" } },
      ];
    }

    const total = await prisma.blogPost.count({ where: filter });
    const list = await prisma.blogPost.findMany({
      where: filter,
      include: { category: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    });

    const data = list.map((p) => ({
      ...p,
      publishedAt: p.publishedAt?.toISOString() || null,
      scheduledAt: p.scheduledAt?.toISOString() || null,
    }));

    return NextResponse.json({
      success: true,
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET admin/blog-posts error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    if (!json.slug && json.title) {
      json.slug = slugify(json.title);
    }
    const body = blogPostSchema.parse(json);

    // unique slug validation
    const exists = await prisma.blogPost.findUnique({
      where: { slug: body.slug || "" },
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

    const item = await prisma.blogPost.create({
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

    if (body.coverMediaId) {
      await prisma.mediaUsage.create({
        data: { mediaId: body.coverMediaId, entityType: "BlogPost", entityId: item.id, fieldKey: "coverImage" },
      }).catch(() => undefined);
    }

    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    console.error("POST admin/blog-posts error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
