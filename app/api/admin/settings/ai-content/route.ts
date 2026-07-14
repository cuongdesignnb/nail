import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { prisma } from "@/lib/db";
import { getOrCreateAiSettings, serializeAiSettings, updateAiSettings } from "@/lib/ai/ai-settings.service";
import { SETTINGS_NO_STORE_HEADERS, settingsFailure, zodIssues } from "@/lib/settings/settings-api";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  isEnabled: z.boolean().optional(),
  apiKey: z.string().trim().optional(),
  textModel: z.string().trim().min(1).optional(),
  imageModel: z.string().trim().min(1).optional(),
  defaultOutputLanguage: z.string().trim().min(2).optional(),
  defaultArticleTone: z.string().trim().min(1).optional(),
  defaultArticleLength: z.coerce.number().int().min(400).max(4000).optional(),
  defaultGenerateImage: z.boolean().optional(),
  defaultImageSize: z.string().trim().min(1).optional(),
  defaultImageQuality: z.string().trim().min(1).optional(),
  maxKeywordsPerBatch: z.coerce.number().int().min(1).max(100).optional(),
  maxConcurrentJobs: z.coerce.number().int().min(1).max(5).optional(),
  maxRetriesPerJob: z.coerce.number().int().min(0).max(5).optional(),
  monthlyBudgetLimit: z.coerce.number().min(0).nullable().optional(),
  humanReviewRequired: z.boolean().optional(),
  autoScheduleEnabled: z.boolean().optional(),
});

export async function GET() {
  try {
    requireAdmin();
    const settings = await getOrCreateAiSettings();
    return Response.json({ success: true, data: serializeAiSettings(settings), meta: { updatedAt: settings.updatedAt.toISOString(), updatedBy: null, publicRevalidated: true } }, { headers: SETTINGS_NO_STORE_HEADERS });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return settingsFailure("Failed to load AI settings", "DATABASE_ERROR", 500);
  }
}

export async function PUT(req: Request) {
  try {
    const session = requireRole(["Owner"]);
    const body = schema.parse(await req.json());
    const settings = await updateAiSettings(body);
    await prisma.auditLog.create({
      data: {
        actor: session.email,
        action: "AI_CONTENT_SETTINGS_UPDATED",
        entity: "AiProviderSetting:openai",
        entityType: "AiProviderSetting",
        details: { isEnabled: settings.isEnabled, textModel: settings.textModel, imageModel: settings.imageModel },
      },
    }).catch(() => undefined);
    return Response.json({ success: true, data: serializeAiSettings(settings), meta: { updatedAt: settings.updatedAt.toISOString(), updatedBy: session.email, publicRevalidated: true } }, { headers: SETTINGS_NO_STORE_HEADERS });
  } catch (error) {
    const role = roleErrorResponse(error);
    if (role) return role;
    const auth = authErrorResponse(error);
    if (auth) return auth;
    if (error instanceof z.ZodError) {
      return settingsFailure("Please correct the highlighted fields.", "VALIDATION_ERROR", 400, zodIssues(error));
    }
    return settingsFailure(error instanceof Error ? error.message : "Failed to save AI settings", "DATABASE_ERROR", 400);
  }
}
