import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { SEO_CACHE_TAGS } from "@/lib/seo/seo-cache";

export async function POST(req: Request) {
  try {
    requireRole(["Owner", "Manager"]);
    const body = await req.json().catch(() => ({}));
    revalidateTag(SEO_CACHE_TAGS.siteSettings);
    revalidateTag(SEO_CACHE_TAGS.sitemap);
    if (typeof body.path === "string" && body.path.startsWith("/")) {
      revalidatePath(body.path);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    const auth = authErrorResponse(error) || roleErrorResponse(error);
    if (auth) return auth;
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

