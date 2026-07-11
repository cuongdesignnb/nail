import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { processStepSchema } from "@/lib/validations/gallery.validation";
import { requireAdminApi } from "@/lib/auth/admin-api";

export async function GET() {
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
  try {
    const steps = await prisma.galleryProcessStep.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: steps });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Database query failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
  try {
    const json = await req.json();
    const result = processStepSchema.safeParse(json);

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

    const created = await prisma.galleryProcessStep.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}
