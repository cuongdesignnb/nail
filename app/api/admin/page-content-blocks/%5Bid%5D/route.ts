import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pageContentBlockSchema } from "@/lib/validations/content-settings.validation";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    const body = pageContentBlockSchema.parse(json);
    const updated = await prisma.pageContentBlock.update({
      where: { id: params.id },
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
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.pageContentBlock.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
