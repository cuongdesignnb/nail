import React from "react";
import { fetchBlogPostBySlug } from "@/services/blog-post.service";
import { PageStructuredData } from "@/components/seo/PageStructuredData";

import { BlogArticleHero } from "@/components/blog/detail/BlogArticleHero";
import { BlogArticleContent } from "@/components/blog/detail/BlogArticleContent";
import { BlogArticleSidebar } from "@/components/blog/detail/BlogArticleSidebar";
import { RecommendedProducts } from "@/components/blog/detail/RecommendedProducts";
import { AuthorBio } from "@/components/blog/detail/AuthorBio";
import { RelatedArticles } from "@/components/blog/detail/RelatedArticles";
import { ReaderTestimonials } from "@/components/blog/detail/ReaderTestimonials";
import { BlogDetailCTA } from "@/components/blog/detail/BlogDetailCTA";
import { buildEntityPageMetadata, resolveEntitySeoMetadata } from "@/lib/seo/seo.service";
import { buildBlogPostingSchema } from "@/lib/seo/schema/blog-posting.schema";
import { buildAbsoluteUrl } from "@/lib/seo/site-url";

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

    return buildEntityPageMetadata({
      scopeKey: `blog:${post.id}`,
      pageKey: "blog",
      pathname: `/blog/${post.slug}`,
      fallbackTitle: post.title,
      fallbackDescription: post.excerpt,
      fallbackImage: post.coverImage,
      fallbackImageAlt: post.coverImageAlt || post.title,
      entitySeo: {
        title: post.seoTitle,
        description: post.seoDescription,
        keywords: post.seoKeywords,
      },
    });
  } catch (err) {
    return {
      title: "Article Not Found | Aera Nail Lounge",
      robots: "noindex,nofollow",
    };
  }
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const data = await fetchBlogPostBySlug(params.slug);
  const seo = await resolveEntitySeoMetadata({
    scopeKey: `blog:${data.post.id}`,
    pageKey: "blog",
    pathname: `/blog/${data.post.slug}`,
    fallbackTitle: data.post.title,
    fallbackDescription: data.post.excerpt,
    fallbackImage: data.post.coverImage,
    fallbackImageAlt: data.post.coverImageAlt || data.post.title,
    entitySeo: {
      title: data.post.seoTitle,
      description: data.post.seoDescription,
      keywords: data.post.seoKeywords,
    },
  });
  const articleSchema = buildBlogPostingSchema({
    headline: seo.title,
    description: seo.description,
    image: data.post.coverImage,
    authorName: data.post.authorName,
    publisherName: seo.globalContent.brand?.name || "Aera Nail Lounge",
    publisherLogo: seo.globalContent.brand?.logo?.src
      ? buildAbsoluteUrl(seo.globalContent.brand.logo.src)
      : undefined,
    datePublished: data.post.publishedAt || data.post.createdAt,
    dateModified: data.post.updatedAt,
    url: buildAbsoluteUrl(`/blog/${data.post.slug}`),
  });

  return (
    <div className="bg-aera-bg min-h-screen text-aera-ink flex flex-col justify-between">
      <PageStructuredData
        pathname={`/blog/${data.post.slug}`}
        title={seo.title}
        faqs={Array.isArray(data.post.faqs) ? data.post.faqs : []}
        extraSchemas={[articleSchema]}
      />
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
    </div>
  );
}
