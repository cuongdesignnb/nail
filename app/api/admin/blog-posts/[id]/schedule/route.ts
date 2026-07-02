import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BlogPostStatus } from "@prisma/client";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    const { scheduledAt } = json;

    if (!scheduledAt) {
      return NextResponse.json({ success: false, message: "scheduledAt date is required" }, { status: 400 });
    }

    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return NextResponse.json({ success: false, message: "scheduledAt must be in the future" }, { status: 400 });
    }

    const updated = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        status: BlogPostStatus.SCHEDULED,
        scheduledAt: scheduledDate,
        publishedAt: null,
      },
    });

    return NextResponse.json({ success: true, message: "Scheduled successfully", data: updated });
  } catch (error) {
    console.error("POST admin/blog-posts/[id]/schedule error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
