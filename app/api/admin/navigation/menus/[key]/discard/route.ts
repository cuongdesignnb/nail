import { NextRequest, NextResponse } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth/require-admin";
import { discardNavigationMenuDraft } from "@/lib/navigation/navigation.service";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest, { params }: { params: { key: string } }) {
  try {
    const session = requireAdmin();
    const data = await discardNavigationMenuDraft(params.key, session.email);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("POST navigation menu discard error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to discard draft" }, { status: 422 });
  }
}
