import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { removeAiApiKey, serializeAiSettings } from "@/lib/ai/ai-settings.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  try {
    requireRole(["Owner"]);
    const settings = await removeAiApiKey();
    return Response.json({ success: true, data: serializeAiSettings(settings) });
  } catch (error) {
    const role = roleErrorResponse(error);
    if (role) return role;
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: "Failed to remove AI key" }, { status: 500 });
  }
}
