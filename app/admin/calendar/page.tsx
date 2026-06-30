import { format } from "date-fns";
import { getBookings } from "@/lib/store";

export default async function AdminCalendarPage() {
  const bookings = await getBookings();
  return (
    <div className="admin-page">
      <section className="admin-section-heading"><h1>Calendar</h1><p>Day, week, month and technician views for appointment operations.</p></section>
      <section className="calendar-board">
        {bookings.map((booking) => <article className={`calendar-item ${booking.status.toLowerCase().replaceAll(" ", "-")}`} key={booking.id}><b>{format(new Date(booking.scheduledStartAt), "h:mm a")}</b><span>{booking.customer.firstName} · {booking.status}</span></article>)}
      </section>
    </div>
  );
}
