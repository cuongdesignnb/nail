import { prisma } from "@/lib/db";

export async function retryAiJob(id: string) {
  const job = await prisma.aiContentJob.update({
    where: { id },
    data: {
      status: "queued",
      errorCode: null,
      errorMessage: null,
      failedAt: null,
      retryAfter: null,
      lockedAt: null,
      lockedBy: null,
    },
  });
  await prisma.aiContentJobEvent.create({
    data: { jobId: id, eventType: "AI_JOB_RETRIED", message: "Job queued for retry." },
  });
  return job;
}

export async function cancelAiJob(id: string) {
  const job = await prisma.aiContentJob.update({
    where: { id },
    data: { status: "cancelled", cancelledAt: new Date(), lockedAt: null, lockedBy: null },
  });
  await prisma.aiContentJobEvent.create({
    data: { jobId: id, eventType: "JOB_CANCELLED", message: "Job cancelled by admin." },
  });
  return job;
}
