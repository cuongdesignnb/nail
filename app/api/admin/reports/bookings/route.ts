import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { z } from "zod";

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
      where,
      select: {
        id: true,
        status: true,
        scheduledStartAt: true,
      },
      orderBy: { scheduledStartAt: "asc" },
    });

    // Status breakdown
    const statusMap = new Map<string, number>();
    const dailyMap = new Map<string, number>();
    let cancelledCount = 0;
    let noShowCount = 0;

    for (const b of bookings) {
      statusMap.set(b.status, (statusMap.get(b.status) || 0) + 1);

      const day = b.scheduledStartAt.toISOString().slice(0, 10);
      dailyMap.set(day, (dailyMap.get(day) || 0) + 1);

      if (b.status === "Cancelled") cancelledCount++;
      if (b.status === "NoShow") noShowCount++;
    }

    const byStatus = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count,
    }));

    const dailyBookings = Array.from(dailyMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    const total = bookings.length;
    const cancellationRate = total > 0 ? Math.round((cancelledCount / total) * 10000) / 100 : 0;
    const noShowRate = total > 0 ? Math.round((noShowCount / total) * 10000) / 100 : 0;

    return Response.json(
      {
        success: true,
        data: {
          byStatus,
          dailyBookings,
          total,
          cancelledCount,
          noShowCount,
          cancellationRate,
          noShowRate,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Booking report error:", error);
    return Response.json({ success: false, error: "Failed to generate booking report" }, { status: 500 });
  }
}
