import React from "react";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { fetchAboutPageContent } from "@/services/about.service";
import { fetchBlogPostBySlug, fetchRelatedPosts } from "@/services/blog-post.service";
import { BlogDetail } from "@/components/blog/BlogDetail";

export const dynamic = "force-dynamic";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const post = await fetchBlogPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Article Not Found | Aera Nail Lounge",
    };
  }

  return {
    title: post.seoTitle || `${post.title} | Aera Nail Lounge`,
    description: post.seoDescription || post.excerpt,
    keywords: post.seoKeywords || undefined,
  };
}

export default async function BlogPostDetailPage({ params }: BlogPostPageProps) {
  const aboutData = await fetchAboutPageContent();
  const post = await fetchBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  let related: any[] = [];
  if (post.categoryId) {
    related = await fetchRelatedPosts(post.categoryId, post.id, 3);
  }

  return (
    <div className="bg-white min-h-screen text-aera-ink flex flex-col justify-between">
      {/* Dynamic layout header */}
      <Header data={aboutData.header} activePath="/blog" />

      {/* Main post details viewer */}
      <BlogDetail post={post} related={related} />

      {/* Shared footer */}
      <Footer
        data={aboutData.footer}
        logo={aboutData.header.logo}
        brandName={aboutData.header.brandName}
      />
    </div>
  );
}
