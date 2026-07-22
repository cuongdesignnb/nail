import { TransactionalEmailKind } from "@prisma/client";
import { prisma } from "@/lib/db";
import { bookingCancelledEmail } from "@/emails/BookingCancelledEmail";
import { bookingCompletedEmail } from "@/emails/BookingCompletedEmail";
import { bookingConfirmedEmail } from "@/emails/BookingConfirmedEmail";
import { bookingRequestReceivedEmail } from "@/emails/BookingRequestReceivedEmail";
import { adminBookingRequestEmail } from "@/emails/AdminBookingRequestEmail";
import { sendTransactionalEmail } from "./mail.service";
import { getPublicSiteSettings } from "@/lib/settings/public-settings.service";

function customerName(booking: Awaited<ReturnType<typeof loadBooking>>) {
  return `${booking?.customer.firstName || ""} ${booking?.customer.lastName || ""}`.trim() || "there";
}

function serviceNames(booking: Awaited<ReturnType<typeof loadBooking>>) {
  return booking?.items.map((item) => item.serviceNameSnapshot || item.service.name).join(", ") || "Selected services";
}

function whenLabel(date: Date | null | undefined, timeZone: string) {
  return date ? date.toLocaleString("en-US", { timeZone, dateStyle: "medium", timeStyle: "short" }) : "To be confirmed";
}

async function loadBooking(id: string) {
  return prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      technician: true,
      items: { include: { service: true } },
      addonItems: true,
    },
  });
}

type LoadedBooking = NonNullable<Awaited<ReturnType<typeof loadBooking>>>;

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function resolveBookingAdminRecipients(input: {
  explicitRecipients?: string | null;
  ownerManagerEmails?: string[];
  salonEmail?: string | null;
  environmentAdminEmail?: string | null;
  smtpReplyToEmail?: string | null;
  smtpFromEmail?: string | null;
  customerEmail?: string | null;
}) {
  const explicit = (input.explicitRecipients || "")
    .split(/[;,]/)
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
  const customerEmail = input.customerEmail?.trim().toLowerCase();
  const candidates = [
    ...explicit,
    ...(input.ownerManagerEmails || []),
    input.salonEmail,
    input.environmentAdminEmail,
    input.smtpReplyToEmail,
    input.smtpFromEmail,
  ];

  return Array.from(new Set(
    candidates
      .map((email) => email?.trim().toLowerCase() || "")
      .filter((email) => validEmail(email) && email !== customerEmail),
  ));
}

function buildAdminBookingUrl(bookingId: string, website: string) {
  const origin = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || website;
  if (!origin) return `/admin/bookings/${encodeURIComponent(bookingId)}`;
  try {
    return new URL(`/admin/bookings/${encodeURIComponent(bookingId)}`, origin).toString();
  } catch {
    return `/admin/bookings/${encodeURIComponent(bookingId)}`;
  }
}

async function sendCustomerRequestEmail(booking: LoadedBooking, timeZone: string) {
  const email = bookingRequestReceivedEmail({
    customerName: customerName(booking),
    bookingCode: booking.bookingCode,
    services: serviceNames(booking),
    technician: booking.technician?.name,
    when: whenLabel(booking.scheduledStartAt, timeZone),
    status: booking.status,
  });
  return sendTransactionalEmail({
    kind: TransactionalEmailKind.BOOKING_REQUEST_RECEIVED,
    to: booking.customer.email,
    subject: email.subject,
    html: email.html,
    entityType: "Booking",
    entityId: booking.id,
    metadata: { audience: "customer", bookingCode: booking.bookingCode },
  });
}

async function loadAdminRecipientSources() {
  const [users, smtp] = await Promise.all([
    prisma.user.findMany({
      where: { role: { in: ["Owner", "Manager"] } },
      select: { email: true },
    }),
    prisma.emailSmtpSetting.findUnique({
      where: { key: "default" },
      select: { fromEmail: true, replyToEmail: true },
    }),
  ]);
  return { users, smtp };
}

async function sendAdminRequestEmails(
  booking: LoadedBooking,
  settings: Awaited<ReturnType<typeof getPublicSiteSettings>>,
) {
  const { users, smtp } = await loadAdminRecipientSources();
  const recipients = resolveBookingAdminRecipients({
    explicitRecipients: process.env.BOOKING_NOTIFICATION_EMAILS,
    ownerManagerEmails: users.map((user) => user.email),
    salonEmail: settings.contact.email,
    environmentAdminEmail: process.env.ADMIN_EMAIL,
    smtpReplyToEmail: smtp?.replyToEmail,
    smtpFromEmail: smtp?.fromEmail,
    customerEmail: booking.customer.email,
  });
  if (!recipients.length) {
    console.warn("[booking-email] No admin notification recipient is configured", { bookingId: booking.id });
    return [];
  }

  const services = [
    serviceNames(booking),
    ...booking.addonItems.map((addon) => addon.addonNameSnapshot),
  ].filter(Boolean).join(", ");
  const rendered = adminBookingRequestEmail({
    bookingCode: booking.bookingCode,
    customerName: customerName(booking),
    customerEmail: booking.customer.email,
    customerPhone: booking.customer.phone,
    services,
    technician: booking.technician?.name,
    when: whenLabel(booking.scheduledStartAt, settings.timezone),
    status: booking.status,
    notes: booking.notes,
    adminBookingUrl: buildAdminBookingUrl(booking.id, settings.contact.website),
  });

  const deliveries = await Promise.allSettled(recipients.map((recipient) => sendTransactionalEmail({
    kind: TransactionalEmailKind.BOOKING_REQUEST_RECEIVED,
    to: recipient,
    subject: rendered.subject,
    html: rendered.html,
    entityType: "Booking",
    entityId: booking.id,
    metadata: { audience: "admin", bookingCode: booking.bookingCode },
  })));
  deliveries.forEach((delivery, index) => {
    if (delivery.status === "rejected") {
      console.error("[booking-email] Admin notification failed", {
        bookingId: booking.id,
        recipient: recipients[index],
        error: delivery.reason instanceof Error ? delivery.reason.message : String(delivery.reason),
      });
    }
  });
  return deliveries;
}

export async function sendBookingRequestReceivedEmail(bookingId: string) {
  const [booking, settings] = await Promise.all([loadBooking(bookingId), getPublicSiteSettings()]);
  if (!booking) return;
  return sendCustomerRequestEmail(booking, settings.timezone);
}

export async function sendBookingCreatedEmails(bookingId: string) {
  const [booking, settings] = await Promise.all([loadBooking(bookingId), getPublicSiteSettings()]);
  if (!booking) return;
  const deliveries = await Promise.allSettled([
    sendCustomerRequestEmail(booking, settings.timezone),
    sendAdminRequestEmails(booking, settings),
  ]);
  deliveries.forEach((delivery, index) => {
    if (delivery.status === "rejected") {
      console.error("[booking-email] New booking delivery failed", {
        bookingId,
        audience: index === 0 ? "customer" : "admin",
        error: delivery.reason instanceof Error ? delivery.reason.message : String(delivery.reason),
      });
    }
  });
  return deliveries;
}

export async function sendBookingStatusEmail(bookingId: string, status: string) {
  const [booking, settings] = await Promise.all([loadBooking(bookingId), getPublicSiteSettings()]);
  if (!booking) return;
  const base = { customerName: customerName(booking), bookingCode: booking.bookingCode, services: serviceNames(booking), when: whenLabel(booking.scheduledStartAt, settings.timezone) };
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
