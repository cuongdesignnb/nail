import { TransactionalEmailKind } from "@prisma/client";
import { prisma } from "@/lib/db";
import { bookingCancelledEmail } from "@/emails/BookingCancelledEmail";
import { bookingCompletedEmail } from "@/emails/BookingCompletedEmail";
import { bookingConfirmedEmail } from "@/emails/BookingConfirmedEmail";
import { bookingRequestReceivedEmail } from "@/emails/BookingRequestReceivedEmail";
import { sendTransactionalEmail } from "./mail.service";

function customerName(booking: Awaited<ReturnType<typeof loadBooking>>) {
  return `${booking?.customer.firstName || ""} ${booking?.customer.lastName || ""}`.trim() || "there";
}

function serviceNames(booking: Awaited<ReturnType<typeof loadBooking>>) {
  return booking?.items.map((item) => item.serviceNameSnapshot || item.service.name).join(", ") || "Selected services";
}

function whenLabel(date?: Date | null) {
  return date ? date.toLocaleString("en-US", { timeZone: "America/Los_Angeles", dateStyle: "medium", timeStyle: "short" }) : "To be confirmed";
}

async function loadBooking(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: { customer: true, technician: true, items: { include: { service: true } } },
  });
}

export async function sendBookingRequestReceivedEmail(bookingId: string) {
  const booking = await loadBooking(bookingId);
  if (!booking) return;
  const email = bookingRequestReceivedEmail({
    customerName: customerName(booking),
    bookingCode: booking.bookingCode,
    services: serviceNames(booking),
    technician: booking.technician?.name,
    when: whenLabel(booking.scheduledStartAt),
    status: booking.status,
  });
  await sendTransactionalEmail({
    kind: TransactionalEmailKind.BOOKING_REQUEST_RECEIVED,
    to: booking.customer.email,
    subject: email.subject,
    html: email.html,
    entityType: "Booking",
    entityId: booking.id,
  });
}

export async function sendBookingStatusEmail(bookingId: string, status: string) {
  const booking = await loadBooking(bookingId);
  if (!booking) return;
  const base = { customerName: customerName(booking), bookingCode: booking.bookingCode, services: serviceNames(booking), when: whenLabel(booking.scheduledStartAt) };
  const normalized = status.toUpperCase();
  const rendered =
    normalized === "CONFIRMED" ? { kind: TransactionalEmailKind.BOOKING_CONFIRMED, email: bookingConfirmedEmail(base) } :
    normalized === "CANCELLED" ? { kind: TransactionalEmailKind.BOOKING_CANCELLED, email: bookingCancelledEmail(base) } :
    normalized === "COMPLETED" ? { kind: TransactionalEmailKind.BOOKING_COMPLETED, email: bookingCompletedEmail(base) } :
    null;
  if (!rendered) return;
  await sendTransactionalEmail({
    kind: rendered.kind,
    to: booking.customer.email,
    subject: rendered.email.subject,
    html: rendered.email.html,
    entityType: "Booking",
    entityId: booking.id,
  });
}
