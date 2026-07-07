export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { prisma } from "@/lib/db";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";

export async function GET() {
  try {
    requireRole(["Owner"]);
    const logs = await prisma.transactionalEmailLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        kind: true,
        status: true,
        recipient: true,
        subject: true,
        entityType: true,
        entityId: true,
        attempts: true,
        lastError: true,
        lastAttemptAt: true,
        sentAt: true,
        nextRetryAt: true,
        createdAt: true,
      },
    });
    return Response.json({ success: true, data: logs });
  } catch (error) {
    return roleErrorResponse(error) || authErrorResponse(error) || Response.json({ success: false, error: "Unable to load email deliveries." }, { status: 500 });
  }
}
