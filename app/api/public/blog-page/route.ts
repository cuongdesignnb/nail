import { NextResponse } from "next/server";
import { fetchBlogPageContent } from "@/services/blog-page.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const keyword = searchParams.get("keyword") || undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 8;

    const data = await fetchBlogPageContent({
      page,
      limit,
      category,
      keyword,
    });

    return NextResponse.json({
      success: true,
      data,
      pagination: data.pagination,
    });
  } catch (error) {
    console.error("GET public/blog-page error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
