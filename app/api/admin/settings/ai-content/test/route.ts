import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { generateAiText } from "@/lib/ai/ai.client";
import { getOrCreateAiSettings, markAiConnectionTest, serializeAiSettings } from "@/lib/ai/ai-settings.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const pingSchema = {
  type: "object",
  additionalProperties: false,
  required: ["ok"],
  properties: { ok: { type: "boolean" } },
};

export async function POST() {
  try {
    requireRole(["Owner"]);
    const settings = await getOrCreateAiSettings();
    await generateAiText({
      model: settings.textModel,
      systemPrompt: "Return compact JSON only.",
      userPrompt: "Return {\"ok\":true}.",
      outputSchema: pingSchema,
      maxOutputTokens: 80,
    });
    const next = await markAiConnectionTest("success");
    return Response.json({ success: true, data: serializeAiSettings(next) });
  } catch (error) {
    await markAiConnectionTest("failed").catch(() => undefined);
    const role = roleErrorResponse(error);
    if (role) return role;
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: error instanceof Error ? error.message : "AI connection test failed" }, { status: 400 });
  }
}
