import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pageTestimonialSchema } from "@/lib/validations/content-settings.validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get("pageKey") || "";

    const whereClause: any = {};
    if (pageKey) {
      whereClause.pageKey = pageKey;
    }

    const list = await prisma.pageTestimonial.findMany({
      where: whereClause,
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = pageTestimonialSchema.parse(json);
    const item = await prisma.pageTestimonial.create({ data: body });
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
