import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { z } from "zod";

export const dynamic = "force-dynamic";

const querySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const { from, to } = querySchema.parse(params);

    const dateFilter: Record<string, unknown> = {};
    if (from) dateFilter.gte = new Date(from);
    if (to) dateFilter.lte = new Date(to);

    const where: Record<string, unknown> = {};
    if (from || to) where.scheduledStartAt = dateFilter;

    const bookings = await prisma.booking.findMany({
      where: { ...where, status: { in: ["Completed", "CheckedIn"] } },
      select: {
        id: true,
        scheduledStartAt: true,
        totalAmount: true,
        taxAmount: true,
        subtotal: true,
        discountAmount: true,
        payments: { select: { amount: true, provider: true, status: true } },
      },
      orderBy: { scheduledStartAt: "asc" },
    });

    // Aggregate daily revenue
    const dailyMap = new Map<string, number>();
    let totalCollected = 0;
    const paymentMethodMap = new Map<string, number>();

    for (const b of bookings) {
      const day = b.scheduledStartAt.toISOString().slice(0, 10);
      const amt = Number(b.totalAmount);
      dailyMap.set(day, (dailyMap.get(day) || 0) + amt);
      totalCollected += amt;

      for (const p of b.payments) {
        if (p.status === "paid") {
          const method = p.provider || "manual";
          paymentMethodMap.set(method, (paymentMethodMap.get(method) || 0) + Number(p.amount));
        }
      }
    }

    const dailyRevenue = Array.from(dailyMap.entries()).map(([date, revenue]) => ({
      date,
      revenue: Math.round(revenue * 100) / 100,
    }));

    const paymentMethods = Array.from(paymentMethodMap.entries()).map(([method, total]) => ({
      method,
      total: Math.round(total * 100) / 100,
    }));

    const avgPerBooking = bookings.length > 0 ? Math.round((totalCollected / bookings.length) * 100) / 100 : 0;

    return Response.json(
      {
        success: true,
        data: {
          dailyRevenue,
          paymentMethods,
          totalCollected: Math.round(totalCollected * 100) / 100,
          avgPerBooking,
          totalBookings: bookings.length,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Revenue report error:", error);
    return Response.json({ success: false, error: "Failed to generate revenue report" }, { status: 500 });
  }
}
