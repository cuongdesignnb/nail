import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    const job = await prisma.aiContentJob.findUnique({
      where: { id: params.id },
      include: { batch: true, events: { orderBy: { createdAt: "desc" } } },
    });
    if (!job) return Response.json({ success: false, error: "Job not found" }, { status: 404 });
    return Response.json({ success: true, data: job });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: "Failed to load AI job" }, { status: 500 });
  }
}
