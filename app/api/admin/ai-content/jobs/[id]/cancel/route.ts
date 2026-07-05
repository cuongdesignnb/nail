import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { cancelAiJob } from "@/lib/ai/ai-content-job.service";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    return Response.json({ success: true, data: await cancelAiJob(params.id) });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: "Failed to cancel AI job" }, { status: 500 });
  }
}
