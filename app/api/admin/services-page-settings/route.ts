import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { settingsSchema } from "@/lib/validations/services.validation";

// TODO: Replace with real admin auth check
async function requireAdmin() {
  return true;
}

const SETTINGS_ID = "services-settings-main";

export async function GET() {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    let settings = await prisma.servicesPageSetting.findUnique({
      where: { id: SETTINGS_ID },
    });

    if (!settings) {
      // Create empty settings row if missing
      settings = await prisma.servicesPageSetting.create({
        data: {
          id: SETTINGS_ID,
          heroEyebrow: "LUXURY NAIL SERVICES",
          heroTitle: "Exceptional Care for Every Nail Style",
        },
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("GET Page Settings Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = settingsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await prisma.servicesPageSetting.upsert({
      where: { id: SETTINGS_ID },
      update: result.data,
      create: {
        id: SETTINGS_ID,
        ...result.data,
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT Page Settings Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
