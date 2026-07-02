import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { addonSchema } from "@/lib/validations/services.validation";

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

    const addon = await prisma.serviceAddon.findUnique({
      where: { id: params.id },
    });

    if (!addon) {
      return NextResponse.json({ success: false, message: "Addon not found" }, { status: 444 });
    }

    return NextResponse.json({ success: true, data: addon });
  } catch (error) {
    console.error("GET Addon Error:", error);
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
    const result = addonSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.serviceAddon.update({
      where: { id: params.id },
      data: result.data,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT Addon Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const deactivated = await prisma.serviceAddon.update({
      where: { id: params.id },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true, message: "Addon deactivated successfully", data: deactivated });
  } catch (error) {
    console.error("DELETE Addon Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
