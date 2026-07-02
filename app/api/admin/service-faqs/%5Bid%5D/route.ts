import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { faqSchema } from "@/lib/validations/services.validation";

// TODO: Replace with real admin auth check
async function requireAdmin() {
  return true;
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const faq = await prisma.serviceFaq.findUnique({
      where: { id: params.id },
    });

    if (!faq) {
      return NextResponse.json({ success: false, message: "FAQ not found" }, { status: 444 });
    }

    return NextResponse.json({ success: true, data: faq });
  } catch (error) {
    console.error("GET FAQ Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = faqSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.serviceFaq.update({
      where: { id: params.id },
      data: result.data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT FAQ Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const deactivated = await prisma.serviceFaq.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "FAQ deactivated successfully", data: deactivated });
  } catch (error) {
    console.error("DELETE FAQ Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
