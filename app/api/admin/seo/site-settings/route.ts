import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { SEO_SITE_SETTING_KEY } from "@/lib/seo/seo.constants";
import { seoSiteSettingsSchema } from "@/lib/seo/seo.validation";
import { SEO_CACHE_TAGS } from "@/lib/seo/seo-cache";
import { revalidateSettingsConsumers } from "@/lib/settings/settings-cache";
import { SETTINGS_NO_STORE_HEADERS, settingsFailure, zodIssues } from "@/lib/settings/settings-api";
import { z } from "zod";

export const dynamic = "force-dynamic";

function serialize(record: any) {
  return {
    ...record,
    latitude: record.latitude == null ? null : Number(record.latitude),
    longitude: record.longitude == null ? null : Number(record.longitude),
  };
}

export async function GET() {
  try {
    requireRole(["Owner", "Manager"]);
    const record = await prisma.seoSiteSetting.upsert({
      where: { key: SEO_SITE_SETTING_KEY },
      create: { key: SEO_SITE_SETTING_KEY },
      update: {},
    });
    return NextResponse.json({ success: true, data: serialize(record), meta: { updatedAt: record.updatedAt.toISOString(), updatedBy: null, publicRevalidated: true } }, { headers: SETTINGS_NO_STORE_HEADERS });
  } catch (error) {
    const auth = authErrorResponse(error) || roleErrorResponse(error);
    if (auth) return auth;
    return settingsFailure("Unable to load SEO settings.", "DATABASE_ERROR", 500);
  }
}

export async function PUT(req: Request) {
  try {
    requireRole(["Owner"]);
    const requestBody = await req.json();
    const body = seoSiteSettingsSchema.parse(requestBody?.data && typeof requestBody.data === "object" ? requestBody.data : requestBody);
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
    revalidateSettingsConsumers(["seo"]);
    return NextResponse.json({ success: true, data: serialize(record), meta: { updatedAt: record.updatedAt.toISOString(), updatedBy: null, publicRevalidated: true } }, { headers: SETTINGS_NO_STORE_HEADERS });
  } catch (error: any) {
    const auth = authErrorResponse(error) || roleErrorResponse(error);
    if (auth) return auth;
    if (error instanceof z.ZodError) {
      return settingsFailure("Please correct the highlighted fields.", "VALIDATION_ERROR", 400, zodIssues(error));
    }
    return settingsFailure("Unable to save SEO settings.", "DATABASE_ERROR", 500);
  }
}
