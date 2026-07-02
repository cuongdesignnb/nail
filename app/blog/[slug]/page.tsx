import React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { fetchAboutPageContent } from "@/services/about.service";
import { fetchBlogPostBySlug } from "@/services/blog-post.service";

import { BlogArticleHero } from "@/components/blog/detail/BlogArticleHero";
import { BlogArticleContent } from "@/components/blog/detail/BlogArticleContent";
import { BlogArticleSidebar } from "@/components/blog/detail/BlogArticleSidebar";
import { RecommendedProducts } from "@/components/blog/detail/RecommendedProducts";
import { AuthorBio } from "@/components/blog/detail/AuthorBio";
import { RelatedArticles } from "@/components/blog/detail/RelatedArticles";
import { ReaderTestimonials } from "@/components/blog/detail/ReaderTestimonials";
import { BlogDetailCTA } from "@/components/blog/detail/BlogDetailCTA";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  try {
    const data = await fetchBlogPostBySlug(params.slug);
    const post = data.post;

    return {
      title: post.seoTitle || `${post.title} | Aera Nail Lounge`,
      description: post.seoDescription || post.excerpt || "",
      openGraph: {
        title: post.seoTitle || post.title,
        description: post.seoDescription || post.excerpt || "",
        images: post.coverImage ? [post.coverImage] : [],
      },
    };
  } catch (err) {
    return {
      title: "Article Not Found | Aera Nail Lounge",
    };
  }
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  // 1. Fetch shared layout header/footer data
  const aboutData = await fetchAboutPageContent();

  // 2. Fetch the aggregate blog details payload
  const data = await fetchBlogPostBySlug(params.slug);

  return (
    <div className="bg-aera-bg min-h-screen text-aera-ink flex flex-col justify-between">
      {/* Header with active blog tab */}
      <Header data={aboutData.header} activePath="/blog" />

      {/* Hero Header */}
      <BlogArticleHero post={data.post} />

      {/* Main Layout Splitting */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
          {/* Main content body */}
          <BlogArticleContent post={data.post} />

          {/* Sticky sidebar */}
          <BlogArticleSidebar
            post={data.post}
            popularCategories={data.popularCategories}
            trendingPosts={data.trendingPosts}
          />
        </div>
      </section>

      {/* Recommended Products */}
      <RecommendedProducts items={data.post.products} />

      {/* Author details card */}
      <AuthorBio post={data.post} />

      {/* Related suggestions */}
      <RelatedArticles posts={data.relatedPosts} />

      {/* Testimonials */}
      <ReaderTestimonials items={data.testimonials} />

      {/* CTA final section */}
      <BlogDetailCTA data={data.cta} />

      {/* Footer */}
      <Footer
        data={aboutData.footer}
        logo={aboutData.header.logo}
        brandName={aboutData.header.brandName}
      />
    </div>
  );
}
