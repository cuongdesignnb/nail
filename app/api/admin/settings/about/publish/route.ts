import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth/require-admin";
import { getAboutContentForAdmin, publishAboutDraft } from "@/lib/repositories/about-content.repository";

export async function POST(request: Request) {
  try {
    const admin = requireAdmin();
    const body = await request.json();
    await publishAboutDraft({ version: Number(body.version), actor: admin.email });
    revalidateTag("about-page");
    revalidatePath("/about");
    const response = NextResponse.json({ success: true, data: await getAboutContentForAdmin() });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    if (error instanceof Error && error.name === "VERSION_CONFLICT") {
      return NextResponse.json({ success: false, error: "This content was updated by another administrator. Reload the latest version before publishing." }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: "Unable to publish About page content." }, { status: 500 });
  }
}
