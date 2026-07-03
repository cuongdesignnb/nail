// ---------------------------------------------------------------------------
// Public bookings API route – create a booking via Prisma
// ---------------------------------------------------------------------------

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createBookingWithPrisma } from '@/lib/repositories/booking.repository';

// ---------------------------------------------------------------------------
// Request validation
// ---------------------------------------------------------------------------

const publicBookingSchema = z.object({
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
    reminderConsent: z.boolean().default(true),
  }),
  notes: z.string().optional(),
  promotionCode: z.string().optional(),
});

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = publicBookingSchema.parse(body);
    const result = await createBookingWithPrisma(input);

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Booking failed',
      },
      { status: 400 },
    );
  }
}
