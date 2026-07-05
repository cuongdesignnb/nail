import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { SEO_SITE_SETTING_KEY } from "@/lib/seo/seo.constants";
import { seoSiteSettingsSchema } from "@/lib/seo/seo.validation";
import { SEO_CACHE_TAGS } from "@/lib/seo/seo-cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    requireRole(["Owner", "Manager"]);
    const record = await prisma.seoSiteSetting.upsert({
      where: { key: SEO_SITE_SETTING_KEY },
      create: { key: SEO_SITE_SETTING_KEY },
      update: {},
    });
    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    const auth = authErrorResponse(error) || roleErrorResponse(error);
    if (auth) return auth;
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    requireRole(["Owner"]);
    const body = seoSiteSettingsSchema.parse(await req.json());
    const data = {
      ...body,
      sameAs: body.sameAs === null ? undefined : (body.sameAs as any),
    };
    const record = await prisma.seoSiteSetting.upsert({
      where: { key: SEO_SITE_SETTING_KEY },
      create: { key: SEO_SITE_SETTING_KEY, ...data },
      update: data,
    });
    revalidateTag(SEO_CACHE_TAGS.siteSettings);
    revalidateTag(SEO_CACHE_TAGS.sitemap);
    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    const auth = authErrorResponse(error) || roleErrorResponse(error);
    if (auth) return auth;
    if (error?.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.flatten() }, { status: 422 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
