import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { sendBookingStatusEmail } from "@/lib/email/booking-mail.service";

const updateBookingSchema = z.object({
  status: z.string().optional(),
  paymentStatus: z.string().optional(),
  internalNotes: z.string().optional(),
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
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        customer: true,
        technician: true,
        items: {
          include: { service: true },
        },
        addonItems: true,
        payments: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: booking },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  let session;
  try {
    session = requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
    throw error;
  }

  try {
    const body = await request.json();
    const parsed = updateBookingSchema.parse(body);

    const existing = await prisma.booking.findUnique({
      where: { id: params.id },
    });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Booking not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.internalNotes !== undefined) updateData.internalNotes = parsed.internalNotes;
    if (parsed.paymentStatus) updateData.paymentStatus = parsed.paymentStatus;

    if (parsed.status) {
      updateData.status = parsed.status;
      const now = new Date();
      switch (parsed.status) {
        case "CHECKED_IN":
          updateData.checkedInAt = now;
          break;
        case "COMPLETED":
          updateData.completedAt = now;
          break;
        case "CANCELLED":
          updateData.cancelledAt = now;
          break;
        case "NO_SHOW":
          updateData.noShowAt = now;
          break;
      }
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: updateData,
      include: {
        customer: true,
        technician: true,
        items: { include: { service: true } },
        addonItems: true,
        payments: { orderBy: { createdAt: "desc" } },
      },
    });

    // Create audit log for status changes
    if (parsed.status && parsed.status !== existing.status) {
      await prisma.auditLog.create({
        data: {
          actor: session.email,
          action: "BOOKING_STATUS_CHANGED",
          entity: JSON.stringify({
            bookingId: params.id,
            bookingCode: existing.bookingCode,
            previousStatus: existing.status,
            newStatus: parsed.status,
          }),
        },
      });
      await sendBookingStatusEmail(booking.id, parsed.status).catch((error) => {
        console.error("Booking status email failed:", error instanceof Error ? error.message : error);
      });
    }

    return NextResponse.json(
      { success: true, data: booking },
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
      { success: false, error: "Failed to update booking" },
      { status: 500 }
    );
  }
}
