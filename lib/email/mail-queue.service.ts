import { TransactionalEmailStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { attemptTransactionalEmail } from "./mail.service";

export async function retryDueTransactionalEmails(limit = 25) {
  const due = await prisma.transactionalEmailLog.findMany({
    where: {
      status: TransactionalEmailStatus.FAILED,
      attempts: { lt: 3 },
      OR: [{ nextRetryAt: null }, { nextRetryAt: { lte: new Date() } }],
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });
  const results = [];
  for (const log of due) {
    results.push(await attemptTransactionalEmail(log.id));
  }
  return { attempted: results.length };
}
