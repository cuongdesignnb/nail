import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

export async function GET(req: NextRequest) {
  try { requireAdmin(); } catch (e) {
    const r = authErrorResponse(e); if (r) return r;
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const search = new URL(req.url).searchParams.get("search") || "";
  const where: any = {};
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
      { bookings: { some: { bookingCode: { contains: search, mode: "insensitive" } } } },
      { bookings: { some: { payments: { some: { providerOrderId: { contains: search, mode: "insensitive" } } } } } },
      { bookings: { some: { payments: { some: { providerCaptureId: { contains: search, mode: "insensitive" } } } } } },
    ];
  }

  const customers = await prisma.customer.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      bookings: {
        select: {
          id: true,
          scheduledStartAt: true,
          payments: { select: { amount: true, status: true, provider: true, paidAt: true } },
        },
        orderBy: { scheduledStartAt: "desc" },
      },
    },
    take: 100,
  });

  const data = customers.map((c) => {
    const paidPayments = c.bookings.flatMap((b) =>
      b.payments.filter((p) => ["paid", "Paid"].includes(p.status))
    );
    const totalSpend = paidPayments.reduce((sum, p) => sum + Number(p.amount), 0);
    const lastVisit = c.bookings[0]?.scheduledStartAt?.toISOString() || null;
    const lastPayment = paidPayments
      .map((p) => p.paidAt)
      .filter(Boolean)
      .sort((a, b) => Number(b) - Number(a))[0]?.toISOString() || null;
    return {
      id: c.id,
      firstName: c.firstName,
      lastName: c.lastName,
      email: c.email,
      phone: c.phone,
      totalBookings: c.totalBookings || c.bookings.length,
      totalSpend,
      lastVisit,
      lastPayment,
      paymentProvider: paidPayments[0]?.provider || null,
    };
  });

  return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
}
