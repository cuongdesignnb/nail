import { inventory, reviews, services, technicians } from "./data";
import type { Booking } from "./types";

export function dashboardMetrics(bookings: Booking[]) {
  const today = new Date().toDateString();
  const todaysAppointments = bookings.filter((booking) => new Date(booking.scheduledStartAt).toDateString() === today && booking.status !== "Cancelled");
  const completed = bookings.filter((booking) => booking.status === "Completed" || booking.paymentStatus === "Paid" || booking.paymentStatus === "Deposit Paid");
  const revenue = completed.reduce((sum, booking) => sum + booking.totalAmount, 0);
  const newClients = bookings.filter((booking) => booking.customer.type === "New").length;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  const statuses = ["Pending", "Confirmed", "Completed", "Cancelled"].map((status) => ({
    status,
    count: bookings.filter((booking) => booking.status === status).length
  }));
  const topTechnicians = technicians.map((tech) => ({
    ...tech,
    appointments: bookings.filter((booking) => booking.technicianId === tech.id).length
  })).sort((a, b) => b.appointments - a.appointments);
  const topServices = services.map((service) => ({
    ...service,
    count: bookings.filter((booking) => booking.serviceIds.includes(service.id)).length
  })).sort((a, b) => b.count - a.count);

  return {
    todaysAppointments: todaysAppointments.length,
    revenue,
    newClients,
    averageRating: Math.round(averageRating * 10) / 10,
    statuses,
    todaysSchedule: todaysAppointments,
    topTechnicians,
    topServices,
    inventoryAlerts: inventory.filter((item) => item.currentStock <= item.reorderLevel)
  };
}
