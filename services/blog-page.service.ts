import { prisma } from "@/lib/db";
import { defaultBlogContent } from "@/data/blog.default";
import { BlogPageContent, BlogPostDTO, BlogCategoryDTO } from "@/types/blog";
import { BlogPostStatus } from "@prisma/client";

// Helper to auto-publish scheduled posts that are due
export async function publishDueScheduledPosts() {
  try {
    const now = new Date();
    await prisma.blogPost.updateMany({
      where: {
        status: BlogPostStatus.SCHEDULED,
        scheduledAt: {
          lte: now,
        },
      },
      data: {
        status: BlogPostStatus.PUBLISHED,
        publishedAt: now,
      },
    });
  } catch (err) {
    console.error("publishDueScheduledPosts error:", err);
  }
}

export async function fetchBlogPageContent(params?: {
  page?: number;
  limit?: number;
  category?: string;
  keyword?: string;
}): Promise<BlogPageContent> {
  try {
    // 1. Process scheduled posts
    await publishDueScheduledPosts();

    const page = params?.page || 1;
    const limit = params?.limit || 8;
    const skip = (page - 1) * limit;

    // 2. Fetch Blog settings
    const settings = await prisma.blogPageSetting.findFirst();

    // 3. Fetch all active categories
    const categoriesDb = await prisma.blogCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { posts: { where: { status: BlogPostStatus.PUBLISHED } } },
        },
      },
    });

    const categoriesList: BlogCategoryDTO[] = categoriesDb.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      imageAlt: c.imageAlt,
      icon: c.icon,
      postCount: c._count.posts,
    }));

    // 4. Base filter for published posts
    const now = new Date();
    const publishedFilter: any = {
      status: BlogPostStatus.PUBLISHED,
      publishedAt: {
        lte: now,
      },
    };

    // Category filtering
    if (params?.category && params.category !== "all" && params.category !== "All") {
      publishedFilter.category = {
        slug: params.category,
      };
    }

    // Keyword filtering
    if (params?.keyword) {
      publishedFilter.OR = [
        { title: { contains: params.keyword, mode: "insensitive" } },
        { excerpt: { contains: params.keyword, mode: "insensitive" } },
        { content: { contains: params.keyword, mode: "insensitive" } },
      ];
    }

    // 5. Fetch Featured Post (isFeatured = true, ignoring active category pagination filter to get the primary featured post)
    const featuredDb = await prisma.blogPost.findFirst({
      where: {
        status: BlogPostStatus.PUBLISHED,
        publishedAt: { lte: now },
        isFeatured: true,
      },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
    });

    const featuredPost: BlogPostDTO | undefined = featuredDb
      ? {
          ...featuredDb,
          publishedAt: featuredDb.publishedAt?.toISOString() || null,
          scheduledAt: featuredDb.scheduledAt?.toISOString() || null,
          category: featuredDb.category
            ? {
                id: featuredDb.category.id,
                name: featuredDb.category.name,
                slug: featuredDb.category.slug,
              }
            : null,
        }
      : undefined;

    // 6. Fetch Side Featured Posts (Latest 2 published excluding primary featured)
    const sideDb = await prisma.blogPost.findMany({
      where: {
        status: BlogPostStatus.PUBLISHED,
        publishedAt: { lte: now },
        isFeatured: false,
      },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 2,
    });

    const sideFeaturedPosts: BlogPostDTO[] = sideDb.map((p) => ({
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

    // 7. Latest Articles Grid (Paginated)
    const total = await prisma.blogPost.count({ where: publishedFilter });
    const latestDb = await prisma.blogPost.findMany({
      where: publishedFilter,
      include: { category: true },
      orderBy: [{ isPinned: "desc" }, { publishedAt: "desc" }],
      skip,
      take: limit,
    });

    const latestPosts: BlogPostDTO[] = latestDb.map((p) => ({
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

    // 8. Popular Categories (Categories with count ordered by post count)
    const popularCategories: BlogCategoryDTO[] = [...categoriesList]
      .sort((a, b) => (b.postCount || 0) - (a.postCount || 0))
      .slice(0, 6);

    // 9. Trending Posts (isTrending = true)
    const trendingDb = await prisma.blogPost.findMany({
      where: {
        status: BlogPostStatus.PUBLISHED,
        publishedAt: { lte: now },
        isTrending: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });

    const trendingPosts: BlogPostDTO[] = trendingDb.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      coverImage: p.coverImage,
      coverImageAlt: p.coverImageAlt,
      status: "PUBLISHED",
      publishedAt: p.publishedAt?.toISOString() || null,
    }));

    // 10. Editor's Picks (isEditorsPick = true)
    const editorsDb = await prisma.blogPost.findMany({
      where: {
        status: BlogPostStatus.PUBLISHED,
        publishedAt: { lte: now },
        isEditorsPick: true,
      },
      include: { category: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    });

    const editorsPicks: BlogPostDTO[] = editorsDb.map((p) => ({
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

    // 11. Testimonials
    const testimonialsDb = await prisma.pageTestimonial.findMany({
      where: { pageKey: "blog", isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const testimonialsList = testimonialsDb.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      avatar: t.avatar,
      avatarAlt: t.avatarAlt,
      rating: t.rating,
      quote: t.quote,
    }));

    // Transform into BlogPageContent structure
    return {
      seo: {
        title: settings?.seoTitle || defaultBlogContent.seo.title,
        description: settings?.seoDescription || defaultBlogContent.seo.description,
      },
      hero: {
        eyebrow: settings?.heroEyebrow || defaultBlogContent.hero.eyebrow,
        title: settings?.heroTitle || defaultBlogContent.hero.title,
        highlight: settings?.heroHighlight || defaultBlogContent.hero.highlight,
        description: settings?.heroDescription || defaultBlogContent.hero.description,
        image: {
          src: settings?.heroImage || defaultBlogContent.hero.image.src,
          alt: settings?.heroImageAlt || defaultBlogContent.hero.image.alt,
        },
        primaryButton: {
          label: settings?.primaryButtonLabel || defaultBlogContent.hero.primaryButton.label,
          href: settings?.primaryButtonHref || defaultBlogContent.hero.primaryButton.href,
        },
        secondaryButton: {
          label: settings?.secondaryButtonLabel || defaultBlogContent.hero.secondaryButton.label,
          href: settings?.secondaryButtonHref || defaultBlogContent.hero.secondaryButton.href,
        },
      },
      categories: categoriesList.length > 0 ? categoriesList : defaultBlogContent.categories,
      featuredPost: featuredPost || defaultBlogContent.featuredPost,
      sideFeaturedPosts: sideFeaturedPosts.length > 0 ? sideFeaturedPosts : defaultBlogContent.sideFeaturedPosts,
      latestPosts: latestPosts.length > 0 ? latestPosts : defaultBlogContent.latestPosts,
      popularCategories: popularCategories.length > 0 ? popularCategories : defaultBlogContent.popularCategories,
      trendingPosts: trendingPosts.length > 0 ? trendingPosts : defaultBlogContent.trendingPosts,
      editorsPicks: editorsPicks.length > 0 ? editorsPicks : defaultBlogContent.editorsPicks,
      testimonials: {
        title: settings?.testimonialsTitle || defaultBlogContent.testimonials.title,
        items: testimonialsList.length > 0 ? testimonialsList : defaultBlogContent.testimonials.items,
      },
      newsletter: {
        title: settings?.newsletterTitle || defaultBlogContent.newsletter.title,
        description: settings?.newsletterDescription || defaultBlogContent.newsletter.description,
        placeholder: settings?.newsletterPlaceholder || defaultBlogContent.newsletter.placeholder,
        buttonLabel: settings?.newsletterButtonLabel || defaultBlogContent.newsletter.buttonLabel,
      },
      cta: {
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
      },
      pagination: {
        page,
        limit,
        total: total || defaultBlogContent.latestPosts.length,
        totalPages: Math.ceil((total || defaultBlogContent.latestPosts.length) / limit),
      },
    };
  } catch (err) {
    console.error("fetchBlogPageContent Prisma error, returning defaults:", err);
    return defaultBlogContent;
  }
}
