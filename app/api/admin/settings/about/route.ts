import { NextResponse } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth/require-admin";
import { getAboutContentForAdmin, saveAboutDraft } from "@/lib/repositories/about-content.repository";
import { aboutContentSchema } from "@/validations/about-content.schema";

export async function GET() {
  try {
    requireAdmin();
    const response = NextResponse.json({ success: true, data: await getAboutContentForAdmin() });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return NextResponse.json({ success: false, error: "Unable to load About page content. Please verify the database connection and try again." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const admin = requireAdmin();
    const body = await request.json();
    const parsed = aboutContentSchema.safeParse(body.content);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Validation failed", issues: parsed.error.flatten() }, { status: 422 });
    }
    await saveAboutDraft({ content: parsed.data, version: Number(body.version), actor: admin.email });
    const response = NextResponse.json({ success: true, data: await getAboutContentForAdmin() });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    if (error instanceof Error && error.name === "VERSION_CONFLICT") {
      return NextResponse.json({ success: false, error: "This content was updated by another administrator. Reload the latest version before saving your changes." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Unable to save About page content. Please verify the database connection and try again." }, { status: 500 });
  }
}
