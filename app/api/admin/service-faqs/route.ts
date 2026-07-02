import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { faqSchema } from "@/lib/validations/services.validation";

// TODO: Replace with real admin auth check
async function requireAdmin() {
  return true;
}

export async function GET() {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const faqs = await prisma.serviceFaq.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: faqs });
  } catch (error) {
    console.error("GET FAQs Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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

    const faq = await prisma.serviceFaq.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, data: faq });
  } catch (error) {
    console.error("POST FAQs Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
