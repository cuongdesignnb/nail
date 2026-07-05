import { prisma } from "@/lib/db";

export async function expireStaleCheckoutSessions() {
  const now = new Date();
  const result = await prisma.bookingCheckoutSession.updateMany({
    where: {
      status: { in: ["created", "approved"] },
      expiresAt: { lt: now },
    },
    data: {
      status: "expired",
      failedAt: now,
      failureCode: "SESSION_EXPIRED",
      failureReason: "Checkout session expired before payment capture.",
    },
  });
  return result.count;
}
