import { prisma } from "@/lib/db";
import { expireStaleCheckoutSessions } from "@/lib/payments/booking-checkout/checkout-expiry";

async function main() {
  const expired = await expireStaleCheckoutSessions();
  const manualReview = await prisma.bookingCheckoutSession.count({
    where: { status: "manual_review" },
  });
  const incomplete = await prisma.bookingCheckoutSession.count({
    where: { status: { in: ["created", "approved", "captured"] }, expiresAt: { gt: new Date() } },
  });
  console.log(JSON.stringify({ expired, manualReview, incomplete }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
