import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { retryAiJob } from "@/lib/ai/ai-content-job.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    return Response.json({ success: true, data: await retryAiJob(params.id) });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: "Failed to retry AI job" }, { status: 500 });
  }
}
