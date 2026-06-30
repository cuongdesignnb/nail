import { NextResponse } from "next/server";
import { getBookings } from "@/lib/store";

export async function GET() {
  const bookings = await getBookings();
  const customers = bookings.map((booking) => ({
    ...booking.customer,
    id: booking.customer.email,
    totalSpend: booking.totalAmount,
    totalBookings: bookings.filter((item) => item.customer.email === booking.customer.email).length,
    lastVisitAt: booking.scheduledStartAt
  }));
  return NextResponse.json({ data: customers });
}
