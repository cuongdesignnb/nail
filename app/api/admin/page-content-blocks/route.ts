import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pageContentBlockSchema } from "@/lib/validations/content-settings.validation";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get("pageKey") || "";

    const whereClause: any = {};
    if (pageKey) {
      whereClause.pageKey = pageKey;
    }

    const list = await prisma.pageContentBlock.findMany({
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
    const body = pageContentBlockSchema.parse(json);
    const item = await prisma.pageContentBlock.create({
      data: {
        pageKey: body.pageKey,
        sectionKey: body.sectionKey,
        blockKey: body.blockKey,
        label: body.label,
        value: body.value,
        jsonValue: body.jsonValue ? JSON.stringify(body.jsonValue) : undefined,
        sortOrder: body.sortOrder,
        isActive: body.isActive,
      },
    });
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
