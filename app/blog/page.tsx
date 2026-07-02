import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { fetchAboutPageContent } from "@/services/about.service"; // reference standard header data
import { fetchBlogPageContent } from "@/services/blog-page.service";
import { BlogHero } from "@/components/blog/BlogHero";
import { BlogCategoryFilters } from "@/components/blog/BlogCategoryFilters";
import { FeaturedArticles } from "@/components/blog/FeaturedArticles";
import { LatestArticles } from "@/components/blog/LatestArticles";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import { BrowseByCategory } from "@/components/blog/BrowseByCategory";
import { EditorsPicks } from "@/components/blog/EditorsPicks";
import { BlogTestimonials } from "@/components/blog/BlogTestimonials";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { BlogCTA } from "@/components/blog/BlogCTA";

export const dynamic = "force-dynamic";

interface BlogPageProps {
  searchParams: {
    page?: string;
    category?: string;
    keyword?: string;
  };
}

export async function generateMetadata() {
  const content = await fetchBlogPageContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
  };
}

export default async function BlogListingPage({ searchParams }: BlogPageProps) {
  // 1. Fetch header layout details from the shared service
  const aboutData = await fetchAboutPageContent();
  
  // 2. Fetch Blog specific contents
  const pageNum = Number(searchParams.page) || 1;
  const categoryParam = searchParams.category || undefined;
  const keywordParam = searchParams.keyword || undefined;

  const content = await fetchBlogPageContent({
    page: pageNum,
    limit: 8,
    category: categoryParam,
    keyword: keywordParam,
  });

  return (
    <div className="bg-aera-cream/10 min-h-screen text-aera-ink flex flex-col justify-between">
      {/* Dynamic layout header */}
      <Header data={aboutData.header} activePath="/blog" />

      {/* Hero Banner */}
      <BlogHero data={content.hero} />

      {/* Category Navigation Bar */}
      <BlogCategoryFilters categories={content.categories} />

      {/* Featured posts grid (Only show on page 1 when no filters/keywords are active) */}
      {pageNum === 1 && !categoryParam && !keywordParam && (
        <FeaturedArticles
          featuredPost={content.featuredPost}
          sidePosts={content.sideFeaturedPosts}
        />
      )}

      {/* Main Layout (Latest articles + Sidebar) */}
      <div id="articles-list" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
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

      {/* Visual Category Blocks */}
      <BrowseByCategory categories={content.categories} />

      {/* Editor's curated pick posts */}
      <EditorsPicks posts={content.editorsPicks} />

      {/* Testimonials section */}
      <BlogTestimonials data={content.testimonials} />

      {/* CTA section */}
      <BlogCTA data={content.cta} />

      {/* Shared site footer */}
      <Footer
        data={aboutData.footer}
        logo={aboutData.header.logo}
        brandName={aboutData.header.brandName}
      />
    </div>
  );
}
