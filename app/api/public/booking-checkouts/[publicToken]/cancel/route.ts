import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(_: Request, { params }: { params: { publicToken: string } }) {
  const session = await prisma.bookingCheckoutSession.updateMany({
    where: { publicToken: params.publicToken, status: { in: ["created", "approved"] } },
    data: { status: "cancelled", cancelledAt: new Date() },
  });
  return Response.json({ success: true, data: { cancelled: session.count > 0 } });
}
