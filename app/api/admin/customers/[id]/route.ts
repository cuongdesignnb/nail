import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

const updateCustomerSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
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
    const customer = await prisma.customer.findUnique({
      where: { id: params.id },
      include: {
        bookings: {
          orderBy: { scheduledStartAt: "desc" },
          include: {
            items: { include: { service: true } },
            payments: true,
            technician: true,
          },
        },
      },
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: "Customer not found" },
        { status: 404 }
      );
    }

    // Calculate stats
    const completedBookings = customer.bookings.filter(
      (b) => b.status === "COMPLETED"
    );
    const totalSpend = completedBookings.reduce(
      (sum, b) => sum + Number(b.totalAmount),
      0
    );
    const stats = {
      totalBookings: customer.bookings.length,
      completedBookings: completedBookings.length,
      totalSpend,
      memberSince: customer.createdAt,
    };

    return NextResponse.json(
      { success: true, data: { ...customer, stats } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch customer" },
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
    const parsed = updateCustomerSchema.parse(body);

    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: parsed,
    });

    return NextResponse.json(
      { success: true, data: customer },
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
      { success: false, error: "Failed to update customer" },
      { status: 500 }
    );
  }
}
