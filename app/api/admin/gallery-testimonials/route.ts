import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { testimonialSchema } from "@/lib/validations/gallery.validation";

export async function GET() {
  try {
    const testimonials = await prisma.galleryTestimonial.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: testimonials });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Database query failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const result = testimonialSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const created = await prisma.galleryTestimonial.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}
