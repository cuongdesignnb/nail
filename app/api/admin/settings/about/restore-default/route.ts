import { NextResponse } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth/require-admin";
import { getAboutContentForAdmin, restoreDefaultAboutDraft } from "@/lib/repositories/about-content.repository";

export async function POST() {
  try {
    const admin = requireAdmin();
    await restoreDefaultAboutDraft(admin.email);
    const response = NextResponse.json({ success: true, data: await getAboutContentForAdmin() });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return NextResponse.json({ success: false, error: "Unable to restore default content." }, { status: 500 });
  }
}
