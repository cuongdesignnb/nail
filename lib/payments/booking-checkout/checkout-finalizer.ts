import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { BookingCustomerPayload, BookingPayload, FinalizeSource, QuoteSnapshot } from "./checkout.types";

function round(value: number) {
  return Math.round(value * 100) / 100;
}

async function generateBookingCode(tx: Prisma.TransactionClient) {
  for (let i = 0; i < 8; i++) {
    const code = `AERA-${Math.floor(100000 + Math.random() * 900000)}`;
    const existing = await tx.booking.findUnique({ where: { bookingCode: code } });
    if (!existing) return code;
  }
  return `AERA-${Date.now().toString(36).toUpperCase()}`;
}

export { generateBookingCode };

export async function finalizePaidCheckout(input: {
  checkoutSessionId?: string;
  publicToken?: string;
  paypalOrderId: string;
  paypalCaptureId: string;
  payer?: { id?: string | null; email?: string | null; name?: string | null };
  amount: number;
  currency: string;
  providerStatus?: string;
  providerPayload?: unknown;
  source: FinalizeSource;
}) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.bookingCheckoutSession.findFirst({
      where: input.checkoutSessionId
        ? { id: input.checkoutSessionId }
        : { publicToken: input.publicToken, paypalOrderId: input.paypalOrderId },
    });
    if (!session) throw new Error("Checkout session not found.");

    if (session.bookingId) {
      const existing = await tx.booking.findUnique({ where: { id: session.bookingId } });
      if (existing) return { id: existing.id, bookingCode: existing.bookingCode, status: "already_finalized" as const };
    }

    if (session.expiresAt < new Date()) {
      await tx.bookingCheckoutSession.update({
        where: { id: session.id },
        data: { status: "expired", failedAt: new Date(), failureCode: "SESSION_EXPIRED" },
      });
      throw new Error("Checkout session has expired.");
    }
    if (session.paypalOrderId !== input.paypalOrderId) throw new Error("PayPal order does not match checkout session.");
    if (round(Number(session.paymentAmount)) !== round(input.amount)) throw new Error("PayPal capture amount mismatch.");
    if (session.currency !== input.currency) throw new Error("PayPal capture currency mismatch.");

    const conflict = await tx.booking.count({
      where: {
        technicianId: session.technicianId,
        status: { in: ["Confirmed", "Pending", "Checked In", "In Service"] },
        scheduledStartAt: { lt: session.scheduledEndAt },
        scheduledEndAt: { gt: session.scheduledStartAt },
      },
    });
    if (conflict > 0) {
      await tx.bookingCheckoutSession.update({
        where: { id: session.id },
        data: {
          status: "manual_review",
          failureCode: "SLOT_CONFLICT_AFTER_CAPTURE",
          failureReason: "Payment captured but appointment slot is no longer available.",
        },
      });
      throw new Error("Payment captured but slot conflict requires manual review.");
    }

    const customerPayload = session.customerPayload as BookingCustomerPayload;
    const bookingPayload = session.bookingPayload as BookingPayload;
    const quote = session.quoteSnapshot as QuoteSnapshot;
    const bookingCode = await generateBookingCode(tx);
    const customer = await tx.customer.upsert({
      where: { email: customerPayload.email },
      create: {
        firstName: customerPayload.firstName,
        lastName: customerPayload.lastName,
        email: customerPayload.email,
        phone: customerPayload.phone,
        reminderConsent: customerPayload.reminderConsent,
        marketingConsent: customerPayload.marketingConsent,
        totalBookings: 1,
        totalSpent: input.amount,
        lastPaymentAt: new Date(),
      },
      update: {
        firstName: customerPayload.firstName,
        lastName: customerPayload.lastName,
        phone: customerPayload.phone,
        reminderConsent: customerPayload.reminderConsent,
        marketingConsent: customerPayload.marketingConsent,
        totalBookings: { increment: 1 },
        totalSpent: { increment: input.amount },
        lastPaymentAt: new Date(),
      },
    });

    const booking = await tx.booking.create({
      data: {
        bookingCode,
        customerId: customer.id,
        technicianId: session.technicianId,
        status: "Confirmed",
        paymentStatus: session.chargeMode === "full" ? "Paid" : "Deposit Paid",
        scheduledStartAt: session.scheduledStartAt,
        scheduledEndAt: session.scheduledEndAt,
        subtotal: quote.subtotal,
        discountAmount: quote.discountAmount,
        taxAmount: quote.taxAmount,
        depositAmount: session.chargeMode === "full" ? 0 : input.amount,
        totalAmount: quote.totalAmount,
        notes: bookingPayload.notes,
      },
    });

    if (quote.services.length) {
      await tx.bookingItem.createMany({
        data: quote.services.map((service) => ({
          bookingId: booking.id,
          serviceId: service.id,
          serviceNameSnapshot: service.name,
          price: service.price,
          duration: service.duration,
        })),
      });
    }

    if (quote.addons.length) {
      await tx.bookingAddonItem.createMany({
        data: quote.addons.map((addon) => ({
          bookingId: booking.id,
          addonId: addon.id,
          addonNameSnapshot: addon.name,
          price: addon.price,
          duration: addon.duration,
        })),
      });
    }

    await tx.payment.create({
      data: {
        bookingId: booking.id,
        amount: input.amount,
        status: "paid",
        provider: "paypal",
        currency: input.currency,
        purpose: session.chargeMode === "full" ? "full" : "deposit",
        providerOrderId: input.paypalOrderId,
        providerCaptureId: input.paypalCaptureId,
        providerPayerId: input.payer?.id ?? null,
        providerPayerEmail: input.payer?.email ?? null,
        providerPayerName: input.payer?.name ?? null,
        providerStatus: input.providerStatus ?? "COMPLETED",
        providerPayload: input.providerPayload as Prisma.InputJsonValue,
        paidAt: new Date(),
      },
    });

    await tx.bookingCheckoutSession.update({
      where: { id: session.id },
      data: {
        status: "finalized",
        bookingId: booking.id,
        paypalCaptureId: input.paypalCaptureId,
        paypalPayerId: input.payer?.id ?? null,
        paypalPayerEmail: input.payer?.email ?? null,
        paypalPayerName: input.payer?.name ?? null,
        completedAt: new Date(),
      },
    });

    await tx.auditLog.createMany({
      data: [
        {
          actor: input.source,
          action: "PAYPAL_CAPTURED",
          entity: `Payment:${input.paypalCaptureId}`,
          entityType: "Payment",
          details: { orderId: input.paypalOrderId, captureId: input.paypalCaptureId },
        },
        {
          actor: input.source,
          action: "BOOKING_AUTO_CONFIRMED",
          entity: `Booking:${booking.id}`,
          entityType: "Booking",
          entityId: booking.id,
          details: { bookingCode },
        },
      ],
    });

    return { id: booking.id, bookingCode, status: "finalized" as const };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
