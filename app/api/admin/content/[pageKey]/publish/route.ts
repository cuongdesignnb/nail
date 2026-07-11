import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { isValidPageKey } from "@/lib/content/content-registry";
import { publishContent, getPageContent } from "@/lib/content/content.repository";
import { revalidateContentCache } from "@/lib/content/content-cache";
import type { ContentPageKey } from "@/lib/content/content.types";
import { getSchemaForPage } from "@/validations/content";
import {
  hydrateBrandingContent,
  verifyBrandingPersistence,
} from "@/lib/settings/branding-persistence";

export async function POST(
  request: NextRequest,
  { params }: { params: { pageKey: string } }
) {
  let admin;
  try {
    admin = requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
    throw error;
  }

  try {
    const { pageKey } = params;

    if (!isValidPageKey(pageKey)) {
      return NextResponse.json(
        { success: false, error: "Invalid page key" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { version } = body as { version: number };

    if (typeof version !== "number") {
      return NextResponse.json(
        { success: false, error: "Missing required field: version" },
        { status: 400 }
      );
    }

    // Load the draft content to validate strictly
    const pageData = await getPageContent(pageKey as ContentPageKey);
    if (!pageData) {
      return NextResponse.json(
        { success: false, error: "Page content not found" },
        { status: 404 }
      );
    }

    // Strict validation check
    const publishSchema = getSchemaForPage(pageKey as ContentPageKey, "publish");
    const parseResult = publishSchema.safeParse(pageData.draftContent);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed: please complete all required fields in this page before publishing.",
          details: parseResult.error.flatten(),
        },
        { status: 422 }
      );
    }

    await publishContent({
      pageKey: pageKey as ContentPageKey,
      version,
      actor: admin.email,
    });

    revalidateContentCache(pageKey as ContentPageKey);

    const data = await getPageContent(pageKey as ContentPageKey);
    if (pageKey === "global") {
      const draft = hydrateBrandingContent(data.draftContent);
      const published = hydrateBrandingContent(data.publishedContent);
      const verification = verifyBrandingPersistence({
        selectedLogo: draft.logo,
        selectedFavicon: draft.favicon,
        draftContent: data.draftContent,
        publishedContent: data.publishedContent,
      });
      const logData = {
        adminEmail: admin.email,
        selectedLogoMediaId: draft.logo?.mediaId ?? null,
        selectedLogoSrc: draft.logo?.src ?? "",
        draftLogoMediaId: draft.logo?.mediaId ?? null,
        draftLogoSrc: draft.logo?.src ?? "",
        publishedLogoMediaId: published.logo?.mediaId ?? null,
        publishedLogoSrc: published.logo?.src ?? "",
        version: data.version,
      };
      if (!verification.matches) {
        console.error(JSON.stringify({ event: "BRANDING_VERIFICATION_FAILED", ...logData }));
        return NextResponse.json(
          { success: false, error: "Published branding did not match the saved draft." },
          { status: 500, headers: { "Cache-Control": "no-store" } },
        );
      }
      console.info(JSON.stringify({ event: "BRANDING_PUBLISHED", ...logData }));
    }
    return NextResponse.json(
      { success: true, data, meta: { version: data.version, updatedAt: data.updatedAt, updatedBy: data.updatedBy } },
      { headers: { "Cache-Control": "no-store, no-cache, must-revalidate", Pragma: "no-cache", Expires: "0" } }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "VERSION_CONFLICT") {
      console.warn(JSON.stringify({ event: "CONTENT_VERSION_CONFLICT", pageKey: params.pageKey }));
      return NextResponse.json(
        { success: false, error: error.message, code: "VERSION_CONFLICT" },
        { status: 409 }
      );
    }

    console.error("POST admin/content/[pageKey]/publish error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to publish content" },
      { status: 500 }
    );
  }
}
