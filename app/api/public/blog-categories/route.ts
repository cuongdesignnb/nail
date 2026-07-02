import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BlogPostStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const list = await prisma.blogCategory.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: { posts: { where: { status: BlogPostStatus.PUBLISHED } } },
        },
      },
    });

    const data = list.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: c.image,
      imageAlt: c.imageAlt,
      icon: c.icon,
      postCount: c._count.posts,
    }));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("GET public/blog-categories error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
