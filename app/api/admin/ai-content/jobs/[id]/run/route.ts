import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { retryAiJob } from "@/lib/ai/ai-content-job.service";
import { runOneAiContentJob } from "@/lib/ai/ai-content-runner";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    await retryAiJob(params.id);
    const result = await runOneAiContentJob(`manual-${params.id}`, params.id);
    return Response.json({ success: true, data: result });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Failed to run AI job" }, { status: 500 });
  }
}
