import { NextRequest, NextResponse } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth/require-admin";
import { getNavigationMenuByKey, saveNavigationMenuDraft } from "@/lib/navigation/navigation.service";

export const dynamic = "force-dynamic";

export async function GET(_req: NextRequest, { params }: { params: { key: string } }) {
  try {
    requireAdmin();
    const data = await getNavigationMenuByKey(params.key);
    if (!data) return NextResponse.json({ success: false, error: "Menu not found" }, { status: 404 });
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("GET navigation menu error:", error);
    return NextResponse.json({ success: false, error: "Failed to load navigation menu" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { key: string } }) {
  try {
    const session = requireAdmin();
    const body = await req.json();
    const data = await saveNavigationMenuDraft(params.key, Array.isArray(body.items) ? body.items : [], session.email);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("PUT navigation menu error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to save menu" }, { status: 422 });
  }
}
