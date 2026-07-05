import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: { params: { publicToken: string } }) {
  const session = await prisma.bookingCheckoutSession.findUnique({
    where: { publicToken: params.publicToken },
    select: {
      publicToken: true,
      status: true,
      paypalOrderId: true,
      bookingId: true,
      expiresAt: true,
      completedAt: true,
      currency: true,
      paymentAmount: true,
      totalAmount: true,
      chargeMode: true,
      bookingPayload: true,
      quoteSnapshot: true,
    },
  });
  if (!session) return Response.json({ success: false, error: "Checkout not found" }, { status: 404 });
  return Response.json({
    success: true,
    data: {
      ...session,
      paymentAmount: Number(session.paymentAmount),
      totalAmount: Number(session.totalAmount),
    },
  });
}
