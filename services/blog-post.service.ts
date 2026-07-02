import { prisma } from "@/lib/db";
import { BlogPostStatus } from "@prisma/client";
import { publishDueScheduledPosts } from "@/services/blog-page.service";
import { defaultBlogContent } from "@/data/blog.default";
import { notFound } from "next/navigation";

export async function fetchBlogPostBySlug(slug: string) {
  try {
    // 1. Process scheduled posts
    await publishDueScheduledPosts();

    const now = new Date();

    // 2. Fetch the target blog post (Only return if PUBLISHED and publishedAt <= now)
    const postDb = await prisma.blogPost.findFirst({
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

    if (!postDb) {
      notFound();
    }

    // Safely parse FAQs and Products from database JSON (if stored)
    const faqs = postDb.faqs ? (typeof postDb.faqs === "string" ? JSON.parse(postDb.faqs) : postDb.faqs) : [];
    const products = postDb.products ? (typeof postDb.products === "string" ? JSON.parse(postDb.products) : postDb.products) : [];

    const post = {
      ...postDb,
      publishedAt: postDb.publishedAt?.toISOString() || null,
      scheduledAt: postDb.scheduledAt?.toISOString() || null,
      faqs,
      products,
      category: postDb.category
        ? {
            id: postDb.category.id,
            name: postDb.category.name,
            slug: postDb.category.slug,
            description: postDb.category.description,
            image: postDb.category.image,
            imageAlt: postDb.category.imageAlt,
            icon: postDb.category.icon,
          }
        : null,
    };

    // 3. Fetch Related Articles (same category, excluding current, limit 3)
    let relatedPosts: any[] = [];
    if (post.categoryId) {
      const relatedDb = await prisma.blogPost.findMany({
        where: {
          categoryId: post.categoryId,
          status: BlogPostStatus.PUBLISHED,
          publishedAt: { lte: now },
          NOT: { id: post.id },
        },
        include: { category: true },
        orderBy: { publishedAt: "desc" },
        take: 3,
      });

      relatedPosts = relatedDb.map((p) => ({
        ...p,
        publishedAt: p.publishedAt?.toISOString() || null,
        scheduledAt: p.scheduledAt?.toISOString() || null,
        faqs: p.faqs as any,
        products: p.products as any,
        category: p.category
          ? {
              id: p.category.id,
              name: p.category.name,
              slug: p.category.slug,
            }
          : null,
      }));
    }

    // 4. Fetch popular categories list
    const categoriesDb = await prisma.blogCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { posts: { where: { status: BlogPostStatus.PUBLISHED, publishedAt: { lte: now } } } },
        },
      },
    });

    const popularCategories = categoriesDb.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      postCount: c._count.posts,
    }));

    // 5. Fetch trending posts (marked isTrending and PUBLISHED, limit 3)
    const trendingDb = await prisma.blogPost.findMany({
      where: {
        status: BlogPostStatus.PUBLISHED,
        publishedAt: { lte: now },
        isTrending: true,
      },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });

    const trendingPosts = trendingDb.map((p) => ({
      ...p,
      publishedAt: p.publishedAt?.toISOString() || null,
      scheduledAt: p.scheduledAt?.toISOString() || null,
      faqs: p.faqs as any,
      products: p.products as any,
      category: p.category
        ? {
            id: p.category.id,
            name: p.category.name,
            slug: p.category.slug,
          }
        : null,
    }));

    // 6. Fetch Page Testimonials (pageKey = 'blog' or 'blog-detail')
    const testimonialsDb = await prisma.pageTestimonial.findMany({
      where: {
        OR: [
          { pageKey: "blog" },
          { pageKey: "blog-detail" }
        ],
        isActive: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    const testimonials = testimonialsDb.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      avatar: t.avatar,
      avatarAlt: t.avatarAlt,
      rating: t.rating,
      quote: t.quote,
    }));

    // 7. Fetch CTA configurations
    const settings = await prisma.blogPageSetting.findFirst();
    const cta = {
      title: settings?.ctaTitle || defaultBlogContent.cta.title,
      description: settings?.ctaDescription || defaultBlogContent.cta.description,
      button: {
        label: settings?.ctaButtonLabel || defaultBlogContent.cta.button.label,
        href: settings?.ctaButtonHref || defaultBlogContent.cta.button.href,
      },
      phone: settings?.phone || defaultBlogContent.cta.phone,
      email: settings?.email || defaultBlogContent.cta.email,
      address: settings?.address || defaultBlogContent.cta.address,
      hours: settings?.hours || defaultBlogContent.cta.hours,
    };

    return {
      post,
      relatedPosts,
      popularCategories,
      trendingPosts,
      testimonials,
      cta,
    };
  } catch (error) {
    console.error("fetchBlogPostBySlug error:", error);
    notFound();
  }
}
