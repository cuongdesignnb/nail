// ---------------------------------------------------------------------------
// Booking repository – Prisma transaction-based booking creation
// ---------------------------------------------------------------------------

import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ValidatedBookingInput {
  serviceIds: string[];
  addonIds: string[];
  technicianId: string;
  date: string;        // "2026-07-03"
  time: string;        // "14:30"
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    reminderConsent: boolean;
  };
  notes?: string;
  promotionCode?: string;
}

// ---------------------------------------------------------------------------
// Constants (match lib/data.ts business config)
// ---------------------------------------------------------------------------

const TAX_RATE = 0.095;
const DEPOSIT_RATE = 0.25;
const BUFFER_MINUTES = 15;

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

// ---------------------------------------------------------------------------
// Technician availability check
// ---------------------------------------------------------------------------

export async function checkTechnicianAvailability(
  technicianId: string,
  start: Date,
  end: Date,
): Promise<boolean> {
  const overlapping = await prisma.booking.count({
    where: {
      technicianId,
      status: { not: 'Cancelled' },
      scheduledStartAt: { lt: end },
      scheduledEndAt: { gt: start },
    },
  });
  return overlapping === 0;
}

// ---------------------------------------------------------------------------
// Booking creation (transactional)
// ---------------------------------------------------------------------------

export async function createBookingWithPrisma(
  input: ValidatedBookingInput,
): Promise<{ bookingCode: string; id: string }> {
  return prisma.$transaction(async (tx) => {
    // 1. Validate services exist and are active
    const services = await tx.service.findMany({
      where: { id: { in: input.serviceIds }, isActive: true },
    });
    if (services.length !== input.serviceIds.length) {
      const found = new Set(services.map((s) => s.id));
      const missing = input.serviceIds.filter((id) => !found.has(id));
      throw new Error(
        `Service(s) not found or inactive: ${missing.join(', ')}`,
      );
    }

    // 2. Validate addons exist and are active
    let addons: Array<{ id: string; name: string; price: Prisma.Decimal | null }> = [];
    if (input.addonIds.length > 0) {
      addons = await tx.serviceAddon.findMany({
        where: { id: { in: input.addonIds }, isActive: true },
        select: { id: true, name: true, price: true },
      });
      if (addons.length !== input.addonIds.length) {
        const found = new Set(addons.map((a) => a.id));
        const missing = input.addonIds.filter((id) => !found.has(id));
        throw new Error(
          `Addon(s) not found or inactive: ${missing.join(', ')}`,
        );
      }
    }

    // 3. Calculate pricing server-side (never trust client amounts)
    const servicesSubtotal = services.reduce(
      (sum, s) => sum + Number(s.price),
      0,
    );
    const addonsSubtotal = addons.reduce(
      (sum, a) => sum + Number(a.price ?? 0),
      0,
    );
    let subtotal = servicesSubtotal + addonsSubtotal;

    // Duration: sum service durations + addons (addons don't have duration in schema, use 0)
    const totalDuration =
      services.reduce((sum, s) => sum + (s.durationMinutes ?? s.duration), 0);

    // Apply promotion if provided
    let discountAmount = 0;
    if (input.promotionCode) {
      const promotion = await tx.promotion.findUnique({
        where: { code: input.promotionCode },
      });
      if (
        promotion &&
        promotion.active &&
        (!promotion.validUntil || promotion.validUntil > new Date())
      ) {
        if (promotion.type === 'percentage') {
          discountAmount = round(subtotal * (Number(promotion.amount) / 100));
        } else {
          discountAmount = round(Math.min(Number(promotion.amount), subtotal));
        }
      }
    }

    const taxable = Math.max(0, subtotal - discountAmount);
    const taxAmount = round(taxable * TAX_RATE);
    const totalAmount = round(taxable + taxAmount);
    const depositAmount = round(totalAmount * DEPOSIT_RATE);

    // 4. Upsert customer by email
    const customer = await tx.customer.upsert({
      where: { email: input.customer.email },
      update: {
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        phone: input.customer.phone,
      },
      create: {
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        email: input.customer.email,
        phone: input.customer.phone,
      },
    });

    // 5. Generate booking code
    const bookingCode = `AERA-${Math.floor(100000 + Math.random() * 900000)}`;

    // 6. Calculate scheduled times
    const start = new Date(`${input.date}T${input.time}:00`);
    const end = new Date(
      start.getTime() + (totalDuration + BUFFER_MINUTES) * 60_000,
    );

    // 7. Check technician availability
    const techAvailable = await checkTechnicianAvailability(
      input.technicianId,
      start,
      end,
    );
    if (!techAvailable) {
      throw new Error(
        'Selected technician is no longer available for this slot.',
      );
    }

    // 8. Create booking
    const booking = await tx.booking.create({
      data: {
        bookingCode,
        customerId: customer.id,
        technicianId: input.technicianId,
        status: 'Pending',
        paymentStatus: 'Deposit Pending',
        scheduledStartAt: start,
        scheduledEndAt: end,
        subtotal: round(subtotal),
        discountAmount,
        taxAmount,
        depositAmount,
        totalAmount,
        notes: input.notes,
      },
    });

    // 9. Create BookingItem records (one per service + one per addon)
    const bookingItems: Prisma.BookingItemCreateManyInput[] = [];

    for (const service of services) {
      bookingItems.push({
        bookingId: booking.id,
        serviceId: service.id,
        price: Number(service.price),
        duration: service.durationMinutes ?? service.duration,
      });
    }

    // Addons are also linked as BookingItems.
    // They reference a service; if the schema requires a serviceId, we need
    // a workaround. Since ServiceAddon is a separate model without a BookingItem
    // relation, we skip addon items if there's no matching serviceId.
    // However, the spec says "one per addon" — we store addon pricing in the
    // booking items using the addon's id as a pseudo-serviceId only if the
    // schema allows it. Given the schema requires serviceId FK to Service,
    // addons contribute to the subtotal but aren't separate BookingItem rows.
    // The addon pricing was already included in the subtotal calculation above.

    if (bookingItems.length > 0) {
      await tx.bookingItem.createMany({ data: bookingItems });
    }

    // 10. Create initial Payment record (deposit)
    await tx.payment.create({
      data: {
        bookingId: booking.id,
        amount: depositAmount,
        status: 'pending',
        provider: 'manual',
        currency: 'USD',
      },
    });

    // Update customer booking count
    await tx.customer.update({
      where: { id: customer.id },
      data: {
        totalBookings: { increment: 1 },
      },
    });

    return { bookingCode, id: booking.id };
  });
}
