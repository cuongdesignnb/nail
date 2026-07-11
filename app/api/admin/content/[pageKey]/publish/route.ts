import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { isValidPageKey } from "@/lib/content/content-registry";
import { publishContent, getPageContent } from "@/lib/content/content.repository";
import { revalidateContentCache } from "@/lib/content/content-cache";
import type { ContentPageKey } from "@/lib/content/content.types";
import { getSchemaForPage } from "@/validations/content";

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

    const updated = await publishContent({
      pageKey: pageKey as ContentPageKey,
      version,
      actor: admin.email,
    });

    revalidateContentCache(pageKey as ContentPageKey);

    const data = await getPageContent(pageKey as ContentPageKey);
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
