import { prisma } from "@/lib/db";

const LOCK_TIMEOUT_MINUTES = 15;

export async function claimNextAiJob(workerId: string, jobId?: string) {
  const staleBefore = new Date(Date.now() - LOCK_TIMEOUT_MINUTES * 60 * 1000);
  const job = await prisma.aiContentJob.findFirst({
    where: {
      ...(jobId ? { id: jobId } : {}),
      OR: [
        { status: "queued" },
        { status: "retrying", retryAfter: { lte: new Date() } },
        { lockedAt: { lt: staleBefore }, status: { in: ["validating", "generating_text", "generating_image", "creating_draft"] } },
      ],
      cancelledAt: null,
    },
    orderBy: [{ createdAt: "asc" }],
  });
  if (!job) return null;
  if (job.attemptCount >= job.maxAttempts) {
    await prisma.aiContentJob.update({
      where: { id: job.id },
      data: {
        status: "failed",
        failedAt: new Date(),
        errorCode: "MAX_ATTEMPTS_REACHED",
        errorMessage: "Job reached the maximum retry count before it could be claimed again.",
      },
    }).catch(() => undefined);
    return null;
  }

  const updated = await prisma.aiContentJob.updateMany({
    where: {
      id: job.id,
      OR: [
        { lockedAt: null },
        { lockedAt: { lt: staleBefore } },
      ],
    },
    data: {
      status: "validating",
      lockedAt: new Date(),
      lockedBy: workerId,
      startedAt: job.startedAt ?? new Date(),
      attemptCount: { increment: 1 },
    },
  });
  if (updated.count !== 1) return null;
  return prisma.aiContentJob.findUnique({ where: { id: job.id }, include: { batch: true } });
}

export async function addAiJobEvent(jobId: string, eventType: string, message?: string, metadata?: unknown) {
  return prisma.aiContentJobEvent.create({
    data: { jobId, eventType, message, metadata: metadata as any },
  });
}
