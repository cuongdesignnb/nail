import { NextResponse } from "next/server";
import { technicians } from "@/lib/data";
import { getBookings } from "@/lib/store";

export async function GET() {
  const bookings = await getBookings();
  return NextResponse.json({ data: technicians.map((tech) => ({ name: tech.name, appointments: bookings.filter((booking) => booking.technicianId === tech.id).length, rating: tech.rating })) });
}
