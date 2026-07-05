import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { isValidPageKey } from "@/lib/content/content-registry";
import { getPageContent, saveDraftContent } from "@/lib/content/content.repository";
import type { ContentPageKey } from "@/lib/content/content.types";
import { getSchemaForPage } from "@/validations/content";

export async function GET(
  _request: NextRequest,
  { params }: { params: { pageKey: string } }
) {
  try {
    requireAdmin();
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

    const data = await getPageContent(pageKey as ContentPageKey);

    return NextResponse.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("GET admin/content/[pageKey] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load page content" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const { content, version } = body as {
      content: Record<string, unknown>;
      version: number;
    };

    if (!content || typeof version !== "number") {
      return NextResponse.json(
        { success: false, error: "Missing required fields: content, version" },
        { status: 400 }
      );
    }

    // Relaxed draft validation
    const draftSchema = getSchemaForPage(pageKey as ContentPageKey, "draft");
    const parseResult = draftSchema.safeParse(content);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Draft validation failed",
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const updated = await saveDraftContent({
      pageKey: pageKey as ContentPageKey,
      content,
      version,
      actor: admin.email,
    });

    return NextResponse.json(
      { success: true, data: { version: updated.version } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "VERSION_CONFLICT") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    console.error("PUT admin/content/[pageKey] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save draft content" },
      { status: 500 }
    );
  }
}
