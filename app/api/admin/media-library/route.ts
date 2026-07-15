import { NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

function authorized() {
  try {
    requireAdmin();
    return null;
  } catch (error) {
    return authErrorResponse(error);
  }
}

export async function GET(request: Request) {
  const authResponse = authorized();
  if (authResponse) return authResponse;
  const target = new URL("/api/admin/media", request.url);
  target.search = new URL(request.url).search;
  return NextResponse.redirect(target, 308);
}

export async function POST() {
  const authResponse = authorized();
  if (authResponse) return authResponse;
  return NextResponse.json(
    { success: false, error: "Upload files through /api/admin/media/upload.", code: "MEDIA_ENDPOINT_RETIRED" },
    { status: 410 },
  );
}
