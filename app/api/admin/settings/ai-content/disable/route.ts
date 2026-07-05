import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { serializeAiSettings, updateAiSettings } from "@/lib/ai/ai-settings.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  try {
    requireRole(["Owner"]);
    const settings = await updateAiSettings({ isEnabled: false });
    return Response.json({ success: true, data: serializeAiSettings(settings) });
  } catch (error) {
    const role = roleErrorResponse(error);
    if (role) return role;
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: "Failed to disable AI Content Studio" }, { status: 500 });
  }
}
