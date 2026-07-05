import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
    const batch = await prisma.aiContentBatch.findUnique({
      where: { id: params.id },
      include: { jobs: { orderBy: { sortOrder: "asc" }, include: { events: { orderBy: { createdAt: "desc" }, take: 10 } } } },
    });
    if (!batch) return Response.json({ success: false, error: "Batch not found" }, { status: 404 });
    return Response.json({ success: true, data: batch });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    return Response.json({ success: false, error: "Failed to load AI content batch" }, { status: 500 });
  }
}
