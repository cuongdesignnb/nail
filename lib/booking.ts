import { z } from "zod";
import { getBookings } from "./store";
import { calculateQuote } from "./pricing";
import { business } from "./data";
import type { Booking } from "./types";

export const bookingSchema = z.object({
  serviceIds: z.array(z.string()).min(1),
  addonIds: z.array(z.string()).default([]),
  technicianId: z.string().min(1),
  date: z.string().min(10),
  time: z.string().min(4),
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(7),
    type: z.enum(["New", "Returning"]).default("New"),
    reminderConsent: z.boolean().default(true)
  }),
  notes: z.string().optional(),
  promotionCode: z.string().optional()
});

export async function canBook(technicianId: string, start: Date, end: Date) {
  const bookings = await getBookings();
  return !bookings.some((booking) => {
    if (booking.technicianId !== technicianId || booking.status === "Cancelled") return false;
    return start.getTime() < new Date(booking.scheduledEndAt).getTime() && end.getTime() > new Date(booking.scheduledStartAt).getTime();
  });
}

export async function buildBooking(input: z.infer<typeof bookingSchema>): Promise<Booking> {
  const quote = calculateQuote(input.serviceIds, input.addonIds, input.promotionCode);
  const start = new Date(`${input.date}T${input.time}:00`);
  const end = new Date(start.getTime() + (quote.duration + business.bufferMinutes) * 60_000);
  const available = await canBook(input.technicianId, start, end);
  if (!available) throw new Error("Selected technician is no longer available for this slot.");

  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    bookingCode: `AERA-${Math.floor(100000 + Math.random() * 900000)}`,
    customer: input.customer,
    serviceIds: input.serviceIds,
    addonIds: input.addonIds,
    technicianId: input.technicianId,
    scheduledStartAt: start.toISOString(),
    scheduledEndAt: end.toISOString(),
    subtotal: quote.subtotal,
    discountAmount: quote.discountAmount,
    taxAmount: quote.taxAmount,
    depositAmount: quote.depositAmount,
    totalAmount: quote.totalAmount,
    status: "Pending",
    paymentStatus: "Deposit Pending",
    notes: input.notes,
    promotionCode: input.promotionCode,
    createdAt: now,
    updatedAt: now
  };
}
