import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { settingsSchema } from "@/lib/validations/gallery.validation";

export async function GET() {
  try {
    let setting = await prisma.galleryPageSetting.findFirst();
    if (!setting) {
      // Return empty configuration layout
      setting = {
        id: "",
        seoTitle: "",
        seoDescription: "",
        heroEyebrow: "",
        heroTitle: "",
        heroHighlight: "",
        heroDescription: "",
        heroImage: "",
        heroImageAlt: "",
        primaryButtonLabel: "",
        primaryButtonHref: "",
        secondaryButtonLabel: "",
        secondaryButtonHref: "",
        whyEyebrow: "",
        whyTitle: "",
        whyDescription: "",
        whyImage: "",
        whyImageAlt: "",
        ctaTitle: "",
        ctaDescription: "",
        ctaButtonLabel: "",
        ctaButtonHref: "",
        phone: "",
        email: "",
        address: "",
        hours: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return NextResponse.json({ success: true, data: setting });
  } catch (error) {
    console.error("GET Admin Gallery Settings Error:", error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const json = await req.json();
    const result = settingsSchema.safeParse(json);

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

    const payload = result.data;
    const existing = await prisma.galleryPageSetting.findFirst();

    let saved;
    if (existing) {
      saved = await prisma.galleryPageSetting.update({
        where: { id: existing.id },
        data: payload,
      });
    } else {
      saved = await prisma.galleryPageSetting.create({
        data: payload,
      });
    }

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("PUT Admin Gallery Settings Error:", error);
    return NextResponse.json({ success: false, message: "Server error occurred" }, { status: 500 });
  }
}
