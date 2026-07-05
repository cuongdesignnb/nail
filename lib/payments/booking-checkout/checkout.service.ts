import crypto from "crypto";
import { Prisma } from "@prisma/client";
import { addMinutes } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { prisma } from "@/lib/db";
import { createPayPalOrder } from "@/lib/payments/paypal/paypal.orders";
import { getOrCreatePayPalConfig } from "@/lib/payments/paypal/paypal.config";
import type { BookingCustomerPayload, BookingPayload, QuoteSnapshot } from "./checkout.types";
import { generateBookingCode } from "./checkout-finalizer";

const TAX_RATE = 0.095;
const BUFFER_MINUTES = 15;
const BLOCKING_BOOKING_STATUSES = [
  "CONFIRMED",
  "PENDING",
  "CHECKED_IN",
  "IN_PROGRESS",
  "Confirmed",
  "Pending",
  "Checked In",
  "In Service",
];
const HOLD_STATUSES = ["created", "approved"];

function round(value: number) {
  return Math.round(value * 100) / 100;
}

function makeToken() {
  return crypto.randomBytes(24).toString("base64url");
}

function asMoney(value: Prisma.Decimal | number | null | undefined) {
  return Number(value ?? 0);
}

export async function getBookingCatalog() {
  const [services, addons, packages, technicians, promotions, business, paymentConfig] = await Promise.all([
    prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, shortDescription: true, duration: true, durationMinutes: true, price: true, categoryId: true },
    }),
    prisma.serviceAddon.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, price: true, priceLabel: true, description: true },
    }),
    prisma.servicePackage.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true, subtitle: true, price: true, priceLabel: true, badge: true },
    }),
    prisma.technician.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, role: true, specialty: true, rating: true, avatar: true },
    }),
    prisma.promotion.findMany({
      where: {
        active: true,
        OR: [{ validUntil: null }, { validUntil: { gt: new Date() } }],
      },
      orderBy: { code: "asc" },
      select: { id: true, code: true, title: true, amount: true, type: true, firstBookingOnly: true, validUntil: true },
    }),
    prisma.businessSetting.upsert({
      where: { key: "default" },
      create: { key: "default" },
      update: {},
    }),
    getOrCreatePayPalConfig(),
  ]);

  return {
    services: services.map((s) => ({
      ...s,
      price: asMoney(s.price),
      durationMinutes: s.durationMinutes ?? s.duration,
    })),
    addons: addons.map((a) => ({ ...a, price: asMoney(a.price) })),
    packages: packages.map((p) => ({ ...p, price: asMoney(p.price) })),
    technicians: technicians.map((t) => ({ ...t, rating: Number(t.rating) })),
    promotions: promotions.map((p) => ({ ...p, amount: asMoney(p.amount) })),
    business: { timezone: business.timezone, currency: business.currency },
    payment: {
      enabled: Boolean(paymentConfig.isEnabled && paymentConfig.clientId && paymentConfig.encryptedClientSecret),
      currency: paymentConfig.currency,
      chargeMode: paymentConfig.chargeMode,
      depositPercentage: Number(paymentConfig.depositPercentage),
      bookingHoldMinutes: paymentConfig.bookingHoldMinutes,
    },
  };
}

export async function calculateBookingQuote(input: {
  serviceIds: string[];
  addonIds: string[];
  promotionCode?: string;
  customerEmail?: string;
}): Promise<QuoteSnapshot> {
  const [paymentConfig, services, addons] = await Promise.all([
    getOrCreatePayPalConfig(),
    prisma.service.findMany({ where: { id: { in: input.serviceIds }, isActive: true } }),
    input.addonIds.length
      ? prisma.serviceAddon.findMany({ where: { id: { in: input.addonIds }, isActive: true } })
      : Promise.resolve([]),
  ]);

  if (services.length !== input.serviceIds.length) throw new Error("One or more selected services are unavailable.");
  if (addons.length !== input.addonIds.length) throw new Error("One or more selected add-ons are unavailable.");

  const serviceSnapshots = services.map((s) => ({
    id: s.id,
    name: s.name,
    price: asMoney(s.price),
    duration: s.durationMinutes ?? s.duration,
  }));
  const addonSnapshots = addons.map((a) => ({
    id: a.id,
    name: a.name,
    price: asMoney(a.price),
    duration: 0,
  }));

  const subtotal = round([...serviceSnapshots, ...addonSnapshots].reduce((sum, item) => sum + item.price, 0));
  const durationMinutes = serviceSnapshots.reduce((sum, item) => sum + item.duration, 0) + addonSnapshots.reduce((sum, item) => sum + item.duration, 0);

  let discountAmount = 0;
  const promotionCode = input.promotionCode?.trim();
  if (promotionCode) {
    const promotion = await prisma.promotion.findUnique({ where: { code: promotionCode } });
    const existingCustomer = input.customerEmail
      ? await prisma.customer.findUnique({ where: { email: input.customerEmail } })
      : null;
    const eligible =
      promotion &&
      promotion.active &&
      (!promotion.validUntil || promotion.validUntil > new Date()) &&
      (!promotion.firstBookingOnly || !existingCustomer || existingCustomer.totalBookings === 0);
    if (eligible) {
      discountAmount =
        promotion.type === "percentage"
          ? round(subtotal * (Number(promotion.amount) / 100))
          : round(Math.min(Number(promotion.amount), subtotal));
    }
  }

  const taxable = Math.max(0, subtotal - discountAmount);
  const taxAmount = round(taxable * TAX_RATE);
  const totalAmount = round(taxable + taxAmount);
  const chargeMode = paymentConfig.chargeMode === "full" ? "full" : "deposit";
  const depositPercentage = Number(paymentConfig.depositPercentage || 25);
  const paymentAmount =
    chargeMode === "full" ? totalAmount : round(totalAmount * (depositPercentage / 100));

  return {
    services: serviceSnapshots,
    addons: addonSnapshots,
    subtotal,
    discountAmount,
    taxAmount,
    totalAmount,
    paymentAmount,
    remainingAmount: round(totalAmount - paymentAmount),
    chargeMode,
    depositPercentage,
    currency: paymentConfig.currency || "USD",
    durationMinutes,
    promotionCode: promotionCode || null,
  };
}

export async function getBusinessTimezone() {
  const business = await prisma.businessSetting.upsert({
    where: { key: "default" },
    create: { key: "default" },
    update: {},
  });
  return business.timezone || "America/Los_Angeles";
}

export async function resolveSchedule(input: { date: string; time: string; durationMinutes: number }) {
  const timezone = await getBusinessTimezone();
  const start = fromZonedTime(`${input.date}T${input.time}:00`, timezone);
  const end = addMinutes(start, input.durationMinutes + BUFFER_MINUTES);
  return { start, end, timezone };
}

export async function hasSlotConflict(input: {
  technicianId: string;
  start: Date;
  end: Date;
  excludeCheckoutId?: string;
}) {
  const [bookingCount, holdCount] = await Promise.all([
    prisma.booking.count({
      where: {
        technicianId: input.technicianId,
        status: { in: BLOCKING_BOOKING_STATUSES },
        scheduledStartAt: { lt: input.end },
        scheduledEndAt: { gt: input.start },
      },
    }),
    prisma.bookingCheckoutSession.count({
      where: {
        id: input.excludeCheckoutId ? { not: input.excludeCheckoutId } : undefined,
        technicianId: input.technicianId,
        status: { in: HOLD_STATUSES },
        expiresAt: { gt: new Date() },
        scheduledStartAt: { lt: input.end },
        scheduledEndAt: { gt: input.start },
      },
    }),
  ]);
  return bookingCount > 0 || holdCount > 0;
}

export async function chooseTechnician(input: {
  technicianId: string;
  start: Date;
  end: Date;
}) {
  const candidates = await prisma.technician.findMany({
    where: input.technicianId === "no-preference"
      ? { isActive: true }
      : { id: input.technicianId, isActive: true },
    orderBy: { name: "asc" },
  });
  for (const tech of candidates) {
    if (!(await hasSlotConflict({ technicianId: tech.id, start: input.start, end: input.end }))) {
      return tech;
    }
  }
  throw new Error("No technician is available for the selected time.");
}

export async function getAvailability(input: {
  serviceIds: string[];
  addonIds: string[];
  technicianId?: string;
  date: string;
}) {
  const quote = await calculateBookingQuote(input);
  const technicians = await prisma.technician.findMany({
    where: input.technicianId && input.technicianId !== "no-preference"
      ? { id: input.technicianId, isActive: true }
      : { isActive: true },
    orderBy: { name: "asc" },
  });
  const slots = ["10:00", "10:30", "11:00", "12:00", "13:30", "14:00", "15:30", "16:00", "17:30", "18:00"];
  const availableSlots: string[] = [];
  const availableTechnicianIds = new Set<string>();
  for (const slot of slots) {
    const { start, end } = await resolveSchedule({ date: input.date, time: slot, durationMinutes: quote.durationMinutes });
    for (const tech of technicians) {
      if (!(await hasSlotConflict({ technicianId: tech.id, start, end }))) {
        availableSlots.push(slot);
        availableTechnicianIds.add(tech.id);
        break;
      }
    }
  }
  return {
    availableSlots,
    durationMinutes: quote.durationMinutes,
    availableTechnicians: technicians
      .filter((tech) => availableTechnicianIds.has(tech.id))
      .map((tech) => ({ id: tech.id, name: tech.name, role: tech.role, specialty: tech.specialty })),
  };
}

export async function createBookingCheckout(input: BookingPayload & { customer: BookingCustomerPayload }) {
  const paymentConfig = await getOrCreatePayPalConfig();
  if (!paymentConfig.isEnabled || !paymentConfig.clientId || !paymentConfig.encryptedClientSecret) {
    throw new Error("Online PayPal payment is not configured yet.");
  }

  const quote = await calculateBookingQuote({
    serviceIds: input.serviceIds,
    addonIds: input.addonIds,
    promotionCode: input.promotionCode,
    customerEmail: input.customer.email,
  });
  const { start, end } = await resolveSchedule({
    date: input.date,
    time: input.time,
    durationMinutes: quote.durationMinutes,
  });
  const technician = await chooseTechnician({ technicianId: input.technicianId, start, end });
  const publicToken = makeToken();
  const idempotencyKey = crypto.randomUUID();
  const expiresAt = addMinutes(new Date(), paymentConfig.bookingHoldMinutes || 15);

  const session = await prisma.bookingCheckoutSession.create({
    data: {
      publicToken,
      customerPayload: input.customer as unknown as Prisma.InputJsonValue,
      bookingPayload: {
        serviceIds: input.serviceIds,
        addonIds: input.addonIds,
        technicianId: technician.id,
        date: input.date,
        time: input.time,
        promotionCode: input.promotionCode,
        notes: input.notes,
        policyAccepted: input.policyAccepted,
        policyVersion: input.policyVersion,
      } satisfies BookingPayload as unknown as Prisma.InputJsonValue,
      quoteSnapshot: quote as unknown as Prisma.InputJsonValue,
      technicianId: technician.id,
      scheduledStartAt: start,
      scheduledEndAt: end,
      currency: quote.currency,
      totalAmount: quote.totalAmount,
      paymentAmount: quote.paymentAmount,
      chargeMode: quote.chargeMode,
      expiresAt,
      idempotencyKey,
    },
  });

  const order = await createPayPalOrder({
    sessionId: session.id,
    publicToken,
    amount: quote.paymentAmount,
    currency: quote.currency,
    description: "Aera Nail Lounge booking payment",
    idempotencyKey,
  });

  await prisma.bookingCheckoutSession.update({
    where: { id: session.id },
    data: { paypalOrderId: order.id },
  });

  await prisma.auditLog.create({
    data: {
      actor: "public",
      action: "PAYPAL_CHECKOUT_CREATED",
      entity: `BookingCheckoutSession:${session.id}`,
      entityType: "BookingCheckoutSession",
      entityId: session.id,
      details: { paypalOrderId: order.id, publicToken },
    },
  }).catch(() => undefined);

  return {
    publicToken,
    paypalOrderId: order.id,
    expiresAt: expiresAt.toISOString(),
    paymentAmount: quote.paymentAmount,
    totalAmount: quote.totalAmount,
    remainingAmount: quote.remainingAmount,
    currency: quote.currency,
    chargeMode: quote.chargeMode,
  };
}

export async function createManualBookingRequest(input: BookingPayload & { customer: BookingCustomerPayload }) {
  const quote = await calculateBookingQuote({
    serviceIds: input.serviceIds,
    addonIds: input.addonIds,
    promotionCode: input.promotionCode,
    customerEmail: input.customer.email,
  });
  const { start, end } = await resolveSchedule({
    date: input.date,
    time: input.time,
    durationMinutes: quote.durationMinutes,
  });
  const technician = await chooseTechnician({ technicianId: input.technicianId, start, end });

  return prisma.$transaction(async (tx) => {
    const conflict = await tx.booking.count({
      where: {
        technicianId: technician.id,
        status: { in: BLOCKING_BOOKING_STATUSES },
        scheduledStartAt: { lt: end },
        scheduledEndAt: { gt: start },
      },
    });
    if (conflict > 0) throw new Error("This time slot was just taken. Please choose another time.");

    const bookingCode = await generateBookingCode(tx);
    const customer = await tx.customer.upsert({
      where: { email: input.customer.email },
      create: {
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        email: input.customer.email,
        phone: input.customer.phone,
        reminderConsent: input.customer.reminderConsent,
        marketingConsent: input.customer.marketingConsent,
        totalBookings: 1,
      },
      update: {
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        phone: input.customer.phone,
        reminderConsent: input.customer.reminderConsent,
        marketingConsent: input.customer.marketingConsent,
        totalBookings: { increment: 1 },
      },
    });

    const booking = await tx.booking.create({
      data: {
        bookingCode,
        customerId: customer.id,
        technicianId: technician.id,
        status: "PENDING",
        paymentStatus: "UNPAID",
        scheduledStartAt: start,
        scheduledEndAt: end,
        subtotal: quote.subtotal,
        discountAmount: quote.discountAmount,
        taxAmount: quote.taxAmount,
        depositAmount: 0,
        totalAmount: quote.totalAmount,
        notes: input.notes,
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

    await tx.auditLog.create({
      data: {
        actor: "public",
        action: "MANUAL_BOOKING_REQUEST_CREATED",
        entity: `Booking:${booking.id}`,
        entityType: "Booking",
        entityId: booking.id,
        details: { bookingCode, paymentStatus: "UNPAID" },
      },
    });

    return {
      booking: { id: booking.id, bookingCode, status: booking.status },
      quote,
    };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
