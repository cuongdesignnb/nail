import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { STATIC_SEO_SCOPE_KEYS } from "@/lib/seo/seo.constants";
import { seoEntitySchema, validateLegacySchemaJson } from "@/lib/seo/seo.validation";
import { SEO_CACHE_TAGS } from "@/lib/seo/seo-cache";

type RouteParams = { params: { scopeKey: string } };

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    requireRole(["Owner", "Manager"]);
    const scopeKey = decodeURIComponent(params.scopeKey);
    const record = await prisma.seoMetadata.findUnique({ where: { scopeKey } });
    return NextResponse.json({
      success: true,
      data: record || {
        scopeKey,
        pageKey: scopeKey.split(":")[0],
        title: "",
        description: "",
        keywords: "",
        focusKeyphrase: "",
        canonicalPath: "",
        robots: "index,follow",
        ogTitle: "",
        ogDescription: "",
        ogImage: "",
        ogImageMediaId: "",
        ogImageAlt: "",
        twitterCard: "summary_large_image",
        schemaJson: null,
      },
    });
  } catch (error) {
    const auth = authErrorResponse(error) || roleErrorResponse(error);
    if (auth) return auth;
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    requireRole(["Owner", "Manager"]);
    const scopeKey = decodeURIComponent(params.scopeKey);
    if (STATIC_SEO_SCOPE_KEYS.has(scopeKey)) {
      return NextResponse.json(
        { success: false, message: "Static page SEO is managed in Content Hub." },
        { status: 422 },
      );
    }
    const body = seoEntitySchema.parse(await req.json());
    const schemaCheck = validateLegacySchemaJson(body.schemaJson);
    if (!schemaCheck.valid) {
      return NextResponse.json({ success: false, message: schemaCheck.error }, { status: 422 });
    }
    const record = await prisma.seoMetadata.upsert({
      where: { scopeKey },
      create: {
        scopeKey,
        pageKey: body.pageKey,
        title: body.title || null,
        description: body.description || null,
        keywords: body.keywords || null,
        focusKeyphrase: body.focusKeyphrase || null,
        canonicalPath: body.canonicalPath || null,
        robots: body.robots || "index,follow",
        ogTitle: body.ogTitle || null,
        ogDescription: body.ogDescription || null,
        ogImage: body.ogImage || null,
        ogImageMediaId: body.ogImageMediaId || null,
        ogImageAlt: body.ogImageAlt || null,
        twitterCard: body.twitterCard || "summary_large_image",
        schemaJson: body.schemaJson || undefined,
      },
      update: {
        pageKey: body.pageKey,
        title: body.title || null,
        description: body.description || null,
        keywords: body.keywords || null,
        focusKeyphrase: body.focusKeyphrase || null,
        canonicalPath: body.canonicalPath || null,
        robots: body.robots || "index,follow",
        ogTitle: body.ogTitle || null,
        ogDescription: body.ogDescription || null,
        ogImage: body.ogImage || null,
        ogImageMediaId: body.ogImageMediaId || null,
        ogImageAlt: body.ogImageAlt || null,
        twitterCard: body.twitterCard || "summary_large_image",
        schemaJson: body.schemaJson || undefined,
      },
    });
    revalidateTag(SEO_CACHE_TAGS.entity(scopeKey));
    revalidateTag(SEO_CACHE_TAGS.sitemap);
    if (record.canonicalPath) revalidatePath(record.canonicalPath);
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

