import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { processStepSchema } from "@/lib/validations/gallery.validation";
import { requireAdminApi } from "@/lib/auth/admin-api";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
  try {
    const step = await prisma.galleryProcessStep.findUnique({
      where: { id: params.id },
    });
    if (!step) {
      return NextResponse.json({ success: false, message: "Process step not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: step });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const updated = await prisma.galleryProcessStep.update({
      where: { id: params.id },
      data: result.data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const unauthorized = requireAdminApi(); if (unauthorized) return unauthorized;
  try {
    const deactivated = await prisma.galleryProcessStep.update({
      where: { id: params.id },
      data: { isActive: false },
    });
    return NextResponse.json({ success: true, data: deactivated });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}

export const PATCH = PUT;
