import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pageFaqSchema } from "@/lib/validations/content-settings.validation";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    const body = pageFaqSchema.parse(json);
    const updated = await prisma.pageFaq.update({
      where: { id: params.id },
      data: body,
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
    await prisma.pageFaq.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
