import { NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

function retiredResponse(error?: unknown) {
  if (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;
  }
  return NextResponse.json(
    { success: false, error: "Use /api/admin/media/[id].", code: "MEDIA_ENDPOINT_RETIRED" },
    { status: 410 },
  );
}

export async function GET() {
  try { requireAdmin(); } catch (error) { return retiredResponse(error); }
  return retiredResponse();
}

export const PUT = GET;
export const DELETE = GET;
