import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

export async function GET(req: NextRequest) {
  try { requireAdmin(); } catch (e) {
    const r = authErrorResponse(e); if (r) return r;
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50")));

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (search) {
    where.OR = [
      { bookingCode: { contains: search, mode: "insensitive" } },
      { customer: { firstName: { contains: search, mode: "insensitive" } } },
      { customer: { lastName: { contains: search, mode: "insensitive" } } },
      { customer: { email: { contains: search, mode: "insensitive" } } },
      { payments: { some: { providerOrderId: { contains: search, mode: "insensitive" } } } },
      { payments: { some: { providerCaptureId: { contains: search, mode: "insensitive" } } } },
    ];
  }

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        customer: { select: { firstName: true, lastName: true, email: true } },
        items: { include: { service: { select: { name: true } } } },
        technician: { select: { name: true } },
        payments: {
          select: { amount: true, status: true, provider: true, purpose: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { scheduledStartAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  const data = bookings.map((b: any) => ({
    id: b.id,
    bookingCode: b.bookingCode,
    customerName: `${b.customer.firstName} ${b.customer.lastName}`,
    customerEmail: b.customer.email,
    services: b.items.map((item: any) => item.service?.name || "Unknown"),
    technician: b.technician?.name || "Any",
    scheduledStartAt: b.scheduledStartAt.toISOString(),
    status: b.status,
    paymentStatus: b.paymentStatus,
    paymentProvider: b.payments[0]?.provider || "manual",
    chargeMode: b.payments[0]?.purpose || null,
    paidAmount: b.payments
      .filter((p: any) => ["paid", "Paid"].includes(p.status))
      .reduce((sum: number, p: any) => sum + Number(p.amount), 0),
    totalAmount: Number(b.totalAmount || 0),
    notes: b.notes,
  }));

  return NextResponse.json(
    { success: true, data, meta: { total, page, limit, pages: Math.ceil(total / limit) } },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(req: NextRequest) {
  try { requireAdmin(); } catch (e) {
    const r = authErrorResponse(e); if (r) return r;
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const booking = await prisma.booking.create({
      data: {
        bookingCode: `BK-${Date.now().toString(36).toUpperCase()}`,
        customer: { connect: { id: body.customerId } },
        technicianId: body.technicianId || null,
        scheduledStartAt: new Date(body.scheduledStartAt),
        scheduledEndAt: body.scheduledEndAt ? new Date(body.scheduledEndAt) : new Date(body.scheduledStartAt),
        status: "PENDING",
        paymentStatus: "UNPAID",
        subtotal: 0,
        totalAmount: 0,
        notes: body.notes || null,
      },
      include: { customer: true, items: true },
    });

    await prisma.auditLog.create({
      data: {
        actor: "admin",
        action: "BOOKING_CREATED",
        entity: `Booking:${booking.id}`,
        entityType: "Booking",
        entityId: booking.id,
        performedBy: "admin",
        details: { bookingCode: booking.bookingCode },
      },
    });

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error("[bookings] POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 });
  }
}
