import { promises as fs } from "fs";
import path from "path";
import { seedBookings } from "./data";
import type { Booking } from "./types";

const dataDir = path.join(process.cwd(), ".data");
const bookingFile = path.join(dataDir, "bookings.json");

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(bookingFile);
  } catch {
    await fs.writeFile(bookingFile, JSON.stringify(seedBookings, null, 2));
  }
}

export async function getBookings(): Promise<Booking[]> {
  await ensureStore();
  const raw = await fs.readFile(bookingFile, "utf8");
  if (!raw.trim()) {
    await saveBookings(seedBookings);
    return seedBookings;
  }
  try {
    return JSON.parse(raw) as Booking[];
  } catch {
    await saveBookings(seedBookings);
    return seedBookings;
  }
}

export async function saveBookings(bookings: Booking[]) {
  await ensureStore();
  await fs.writeFile(bookingFile, JSON.stringify(bookings, null, 2));
}

export async function createBooking(booking: Booking) {
  const bookings = await getBookings();
  bookings.unshift(booking);
  await saveBookings(bookings);
  return booking;
}
