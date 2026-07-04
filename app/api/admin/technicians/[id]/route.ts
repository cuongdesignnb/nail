import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

const updateTechnicianSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  specialty: z.string().optional(),
  avatar: z.string().optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
    throw error;
  }

  try {
    const technician = await prisma.technician.findUnique({
      where: { id: params.id },
      include: {
        bookings: {
          orderBy: { scheduledStartAt: "desc" },
          include: {
            customer: true,
            items: { include: { service: true } },
          },
        },
      },
    });

    if (!technician) {
      return NextResponse.json(
        { success: false, error: "Technician not found" },
        { status: 404 }
      );
    }

    const completedBookings = technician.bookings.filter(
      (b) => b.status === "COMPLETED"
    );
    const upcomingBookings = technician.bookings.filter(
      (b) =>
        new Date(b.scheduledStartAt) > new Date() &&
        !["CANCELLED", "NO_SHOW", "COMPLETED"].includes(b.status)
    );
    const totalRevenue = completedBookings.reduce(
      (sum, b) => sum + Number(b.totalAmount),
      0
    );

    const stats = {
      completedCount: completedBookings.length,
      upcomingCount: upcomingBookings.length,
      totalRevenue,
      rating: Number(technician.rating),
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          ...technician,
          stats,
          upcomingBookings: upcomingBookings.slice(0, 10),
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch technician" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
    throw error;
  }

  try {
    const body = await request.json();
    const parsed = updateTechnicianSchema.parse(body);

    const technician = await prisma.technician.update({
      where: { id: params.id },
      data: parsed,
    });

    return NextResponse.json(
      { success: true, data: technician },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update technician" },
      { status: 500 }
    );
  }
}
