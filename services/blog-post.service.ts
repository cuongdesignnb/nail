import { prisma } from "@/lib/db";
import { BlogPostDTO } from "@/types/blog";
import { BlogPostStatus } from "@prisma/client";
import { publishDueScheduledPosts } from "./blog-page.service";

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPostDTO | null> {
  try {
    // Process scheduled posts
    await publishDueScheduledPosts();

    const now = new Date();
    const post = await prisma.blogPost.findFirst({
      where: {
        slug,
        status: BlogPostStatus.PUBLISHED,
        publishedAt: {
          lte: now,
        },
      },
      include: {
        category: true,
      },
    });

    if (!post) return null;

    return {
      ...post,
      publishedAt: post.publishedAt?.toISOString() || null,
      scheduledAt: post.scheduledAt?.toISOString() || null,
      category: post.category
        ? {
            id: post.category.id,
            name: post.category.name,
            slug: post.category.slug,
          }
        : null,
    };
  } catch (err) {
    console.error(`fetchBlogPostBySlug error for slug ${slug}:`, err);
    return null;
  }
}

export async function fetchRelatedPosts(categoryId: string, excludePostId: string, limit = 3): Promise<BlogPostDTO[]> {
  try {
    const now = new Date();
    const list = await prisma.blogPost.findMany({
      where: {
        categoryId,
        status: BlogPostStatus.PUBLISHED,
        publishedAt: { lte: now },
        NOT: { id: excludePostId },
      },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: limit,
    });

    return list.map((p) => ({
      ...p,
      publishedAt: p.publishedAt?.toISOString() || null,
      scheduledAt: p.scheduledAt?.toISOString() || null,
      category: p.category
        ? {
            id: p.category.id,
            name: p.category.name,
            slug: p.category.slug,
          }
        : null,
    }));
  } catch (err) {
    console.error("fetchRelatedPosts error:", err);
    return [];
  }
}
