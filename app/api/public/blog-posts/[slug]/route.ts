import { NextResponse } from "next/server";
import { fetchBlogPostBySlug } from "@/services/blog-post.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json({ success: false, message: "Slug is required" }, { status: 400 });
    }

    const data = await fetchBlogPostBySlug(slug);
    if (!data) {
      return NextResponse.json({ success: false, message: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("GET public/blog-posts/[slug] error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
