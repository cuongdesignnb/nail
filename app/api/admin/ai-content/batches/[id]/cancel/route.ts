import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    const now = new Date();
    await prisma.aiContentJob.updateMany({
      where: { batchId: params.id, status: { notIn: ["completed", "failed", "cancelled", "skipped_duplicate"] } },
      data: { status: "cancelled", cancelledAt: now, lockedAt: null, lockedBy: null },
    });
    const batch = await prisma.aiContentBatch.update({ where: { id: params.id }, data: { status: "cancelled", cancelledAt: now } });
    return Response.json({ success: true, data: batch });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: "Failed to cancel AI batch" }, { status: 500 });
  }
}
