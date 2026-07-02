import { NextResponse } from "next/server";
import { fetchBlogPostBySlug, fetchRelatedPosts } from "@/services/blog-post.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ success: false, message: "Slug is required" }, { status: 400 });
    }

    const post = await fetchBlogPostBySlug(slug);
    if (!post) {
      return NextResponse.json({ success: false, message: "Article not found or not published yet" }, { status: 404 });
    }

    // Fetch related articles
    let related: any[] = [];
    if (post.categoryId) {
      related = await fetchRelatedPosts(post.categoryId, post.id, 3);
    }

    return NextResponse.json({
      success: true,
      data: post,
      related,
    });
  } catch (error) {
    console.error("GET public/blog-posts/[slug] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
