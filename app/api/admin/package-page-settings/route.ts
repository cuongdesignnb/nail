import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { packagePageSettingSchema } from "@/lib/validations/packages.validation";

export async function GET() {
  try {
    let setting = await prisma.packagePageSetting.findFirst();
    if (!setting) {
      // create default initial setting
      setting = await prisma.packagePageSetting.create({
        data: {
          id: "pkg-settings",
          seoTitle: "Packages & Memberships | Aera Nail Lounge",
          seoDescription: "Explore our curated service packages and monthly self-care memberships.",
        },
      });
    }
    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    console.error("GET admin settings error:", error);
    return NextResponse.json({ success: false, message: "Failed to load settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const json = await req.json();
    const body = packagePageSettingSchema.parse(json);

    let setting = await prisma.packagePageSetting.findFirst();
    if (!setting) {
      setting = await prisma.packagePageSetting.create({
        data: {
          id: "pkg-settings",
          ...body,
        },
      });
    } else {
      setting = await prisma.packagePageSetting.update({
        where: { id: setting.id },
        data: body,
      });
    }

    return NextResponse.json({ success: true, data: setting });
  } catch (error: any) {
    console.error("PUT admin settings error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, message: "Validation failed", errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Failed to update settings" }, { status: 500 });
  }
}
