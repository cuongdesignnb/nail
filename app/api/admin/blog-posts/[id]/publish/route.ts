import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BlogPostStatus } from "@prisma/client";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const updated = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        status: BlogPostStatus.PUBLISHED,
        publishedAt: new Date(),
        scheduledAt: null,
      },
    });

    return NextResponse.json({ success: true, message: "Published now", data: updated });
  } catch (error) {
    console.error("POST admin/blog-posts/[id]/publish error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
