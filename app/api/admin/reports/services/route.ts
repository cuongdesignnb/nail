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

    const bookingWhere: Record<string, unknown> = { status: "Completed" };
    if (from || to) bookingWhere.scheduledStartAt = dateFilter;

    const services = await prisma.service.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        price: true,
        items: {
          where: { booking: bookingWhere },
          select: {
            price: true,
          },
        },
      },
    });

    const data = services
      .map((svc) => ({
        id: svc.id,
        name: svc.name,
        price: Number(svc.price),
        bookings: svc.items.length,
        revenue: Math.round(svc.items.reduce((s, i) => s + Number(i.price), 0) * 100) / 100,
      }))
      .filter((s) => s.bookings > 0)
      .sort((a, b) => b.bookings - a.bookings);

    return Response.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Service report error:", error);
    return Response.json({ success: false, error: "Failed to generate service report" }, { status: 500 });
  }
}
