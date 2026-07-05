import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { createAiContentBatch, getAiContentDashboard, inspectKeywordDuplicates } from "@/lib/ai/ai-content.service";
import { getAiUsageSummary } from "@/lib/ai/ai-usage.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const schema = z.object({
  rawKeywordInput: z.string().min(1),
  categoryId: z.string().nullable().optional(),
  generationMode: z.enum(["draft", "schedule"]).default("draft"),
  scheduleStartAt: z.string().datetime().nullable().optional(),
  scheduleIntervalHours: z.coerce.number().int().min(1).max(168).nullable().optional(),
  timezone: z.string().nullable().optional(),
  generateImages: z.boolean().optional(),
  outputLanguage: z.string().optional(),
  textModel: z.string().optional(),
  imageModel: z.string().optional(),
});

export async function GET(req: Request) {
  try {
    requireAdmin();
    const { searchParams } = new URL(req.url);
    const preview = searchParams.get("preview");
    if (preview) {
      return Response.json({ success: true, data: await inspectKeywordDuplicates(preview) });
    }
    const [dashboard, usage] = await Promise.all([getAiContentDashboard(), getAiUsageSummary()]);
    return Response.json({ success: true, data: { ...dashboard, usage } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Failed to load AI content dashboard" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = requireAdmin();
    const body = schema.parse(await req.json());
    const batch = await createAiContentBatch({
      ...body,
      scheduleStartAt: body.scheduleStartAt ? new Date(body.scheduleStartAt) : null,
      requestedBy: session.email,
    });
    return Response.json({ success: true, data: batch });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: "Validation failed", issues: error.issues }, { status: 400 });
    }
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Failed to create AI content batch" }, { status: 400 });
  }
}
