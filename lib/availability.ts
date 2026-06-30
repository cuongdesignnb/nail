import type { Booking } from "./types";
import { business, services, technicians } from "./data";

export function getQualifiedTechnicians(serviceIds: string[]) {
  if (serviceIds.length === 0) return technicians;
  return technicians.filter((tech) => serviceIds.every((serviceId) => tech.serviceIds.includes(serviceId)));
}

export function getTimeSlots(date: string, technicianId: string, duration: number, bookings: Booking[]) {
  const slots: { time: string; available: boolean }[] = [];
  const day = new Date(`${date}T00:00:00`);
  for (let hour = 10; hour < 20; hour += 1) {
    for (const minute of [0, 30]) {
      const start = new Date(day);
      start.setHours(hour, minute, 0, 0);
      const end = new Date(start.getTime() + (duration + business.bufferMinutes) * 60_000);
      const withinHours = end.getHours() < 20 || (end.getHours() === 20 && end.getMinutes() === 0);
      const overlaps = bookings.some((booking) => {
        if (booking.technicianId !== technicianId || booking.status === "Cancelled") return false;
        const bookingStart = new Date(booking.scheduledStartAt).getTime();
        const bookingEnd = new Date(booking.scheduledEndAt).getTime();
        return start.getTime() < bookingEnd && end.getTime() > bookingStart;
      });
      slots.push({ time: start.toTimeString().slice(0, 5), available: withinHours && !overlaps });
    }
  }
  return slots;
}

export function servicesDuration(serviceIds: string[]) {
  return services.filter((service) => serviceIds.includes(service.id)).reduce((sum, service) => sum + service.duration, 0);
}
