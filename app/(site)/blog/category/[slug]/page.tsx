import React from "react";
import { notFound } from "next/navigation";
import { fetchBlogPageContent } from "@/services/blog-page.service";
import { prisma } from "@/lib/db";
import { LatestArticles } from "@/components/blog/LatestArticles";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { ArrowLeft, Compass } from "lucide-react";
import Link from "next/link";
import { buildEntityPageMetadata } from "@/lib/seo/seo.service";
import { PageStructuredData } from "@/components/seo/PageStructuredData";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await prisma.blogCategory.findUnique({
    where: { slug: params.slug },
  });
  if (!category || !category.isActive) {
    return { title: "Category Not Found | Aera Nail Lounge", robots: "noindex,nofollow" };
  }
  return buildEntityPageMetadata({
    scopeKey: `blog-category:${category.id}`,
    pageKey: "blog-category",
    pathname: `/blog/category/${category.slug}`,
    fallbackTitle: `${category.name} Journal`,
    fallbackDescription: category.description || `Read guides and trends about ${category.name}.`,
    fallbackImage: category.image,
    fallbackImageAlt: category.imageAlt || category.name,
  });
}

export default async function BlogCategoryPage({ params, searchParams }: CategoryPageProps) {
  // 1. Verify category exists
  const category = await prisma.blogCategory.findUnique({
    where: { slug: params.slug },
  });
  
  if (!category || !category.isActive) {
    notFound();
  }

  const pageNum = Number(searchParams.page) || 1;

  // 2. Fetch content for that specific category slug
  const content = await fetchBlogPageContent({
    page: pageNum,
    limit: 8,
    category: params.slug,
  });

  return (
    <div className="bg-aera-cream/10 min-h-screen text-aera-ink flex flex-col justify-between">
      <PageStructuredData pathname={`/blog/category/${category.slug}`} title={category.name} />
      {/* Category Hero */}
      <section className="bg-aera-cream/35 py-12 md:py-16 border-b border-aera-champagne/40 text-left">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold text-aera-accent hover:underline uppercase tracking-wider mb-4 decoration-none"
          >
            <ArrowLeft size={12} />
            <span>All Articles</span>
          </Link>
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 text-[9px] font-bold tracking-widest text-aera-accent uppercase">
              <Compass size={10} />
              <span>Category Journal</span>
            </span>
            <h1 className="font-heading text-3xl md:text-4xl text-aera-ink font-normal">
              {category.name}
            </h1>
            {category.description && (
              <p className="font-sans text-xs md:text-sm text-aera-muted leading-relaxed max-w-2xl">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Listings Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          
          {/* Latest Articles list */}
          <div className="lg:col-span-8">
            <LatestArticles posts={content.latestPosts} />
            <BlogPagination pagination={content.pagination} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <BlogSidebar
              popularCategories={content.popularCategories}
              trendingPosts={content.trendingPosts}
              newsletter={content.newsletter}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
