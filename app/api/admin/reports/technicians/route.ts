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

    const technicians = await prisma.technician.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        specialty: true,
        rating: true,
        avatar: true,
        bookings: {
          where: bookingWhere,
          select: { totalAmount: true },
        },
      },
    });

    const data = technicians.map((tech) => {
      const completed = tech.bookings.length;
      const revenue = tech.bookings.reduce((sum, b) => sum + Number(b.totalAmount), 0);
      return {
        id: tech.id,
        name: tech.name,
        specialty: tech.specialty,
        avatar: tech.avatar,
        completed,
        revenue: Math.round(revenue * 100) / 100,
        avgRating: Number(tech.rating),
      };
    });

    data.sort((a, b) => b.revenue - a.revenue);

    return Response.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Technician report error:", error);
    return Response.json({ success: false, error: "Failed to generate technician report" }, { status: 500 });
  }
}
