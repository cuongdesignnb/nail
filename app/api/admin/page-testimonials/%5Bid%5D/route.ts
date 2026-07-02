import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { pageTestimonialSchema } from "@/lib/validations/content-settings.validation";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    const body = pageTestimonialSchema.parse(json);
    const updated = await prisma.pageTestimonial.update({
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
    await prisma.pageTestimonial.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
