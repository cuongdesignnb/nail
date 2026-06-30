import { format } from "date-fns";
import { AdminTablePage } from "@/components/admin/AdminTablePage";
import { getBookings } from "@/lib/store";
import { services, technicians } from "@/lib/data";

export default async function AdminBookingsPage() {
  const bookings = await getBookings();
  return <AdminTablePage title="Bookings" copy="Filter, edit, reschedule, cancel and track payment status." headers={["Code", "Client", "Service", "Technician", "Time", "Status", "Payment"]} rows={bookings.map((booking) => [
    booking.bookingCode,
    `${booking.customer.firstName} ${booking.customer.lastName}`,
    booking.serviceIds.map((id) => services.find((service) => service.id === id)?.name).join(", "),
    technicians.find((tech) => tech.id === booking.technicianId)?.name ?? "No Preference",
    format(new Date(booking.scheduledStartAt), "MMM d, h:mm a"),
    booking.status,
    booking.paymentStatus
  ])} actions={<a className="primary-btn" href="/booking">Create Booking</a>} />;
}
