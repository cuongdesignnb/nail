import { format } from "date-fns";
import { CalendarCheck, DollarSign, Star, UserPlus, type LucideIcon } from "lucide-react";
import { dashboardMetrics } from "@/lib/admin";
import { getBookings } from "@/lib/store";
import { services, technicians } from "@/lib/data";

export default async function AdminDashboard() {
  const bookings = await getBookings();
  const metrics = dashboardMetrics(bookings);
  const kpis: { label: string; value: string | number; delta: string; Icon: LucideIcon }[] = [
    { label: "Today Appointments", value: metrics.todaysAppointments, delta: "+12%", Icon: CalendarCheck },
    { label: "Total Revenue", value: `$${metrics.revenue.toFixed(0)}`, delta: "+8%", Icon: DollarSign },
    { label: "New Clients", value: metrics.newClients, delta: "+4%", Icon: UserPlus },
    { label: "Average Rating", value: metrics.averageRating, delta: "+0.2", Icon: Star }
  ];

  return (
    <div className="admin-page">
      <section className="welcome-card">
        <div>
          <span>{format(new Date(), "EEEE, MMMM d, yyyy")}</span>
          <h1>Welcome back, Sophia</h1>
          <p>Your salon dashboard is live with booking, inventory and revenue insights.</p>
        </div>
        <div>
          <a className="primary-btn" href="/booking">Create Booking</a>
          <a className="secondary-btn" href="/admin/calendar">View Today Schedule</a>
        </div>
      </section>

      <section className="admin-kpis">
        {kpis.map(({ label, value, delta, Icon }) => (
          <article className="admin-card" key={label}>
            <Icon size={24} />
            <span>{label}</span>
            <h2>{value}</h2>
            <p>{delta} vs last period</p>
          </article>
        ))}
      </section>

      <section className="admin-grid">
        <article className="admin-card chart-card">
          <h3>Revenue Overview</h3>
          <div className="line-chart" />
          <div className="chart-tabs"><button>Weekly</button><button>Monthly</button><button>Yearly</button></div>
        </article>
        <article className="admin-card">
          <h3>Booking Status</h3>
          <div className="donut-chart" />
          {metrics.statuses.map((item) => <p key={item.status}>{item.status} <b>{item.count}</b></p>)}
        </article>
        <article className="admin-card">
          <h3>Today Schedule</h3>
          {metrics.todaysSchedule.map((booking) => <p key={booking.id}>{format(new Date(booking.scheduledStartAt), "h:mm a")} · {booking.customer.firstName} · {booking.status}</p>)}
        </article>
        <article className="admin-card">
          <h3>Quick Actions</h3>
          {["Create Booking", "Add Customer", "Update Inventory", "Export Report"].map((item) => <button key={item}>{item}</button>)}
        </article>
        <article className="admin-card wide">
          <h3>Upcoming Appointments</h3>
          <table><tbody>{bookings.map((booking) => <tr key={booking.id}><td>{booking.bookingCode}</td><td>{booking.customer.firstName} {booking.customer.lastName}</td><td>{booking.status}</td><td>${booking.totalAmount}</td></tr>)}</tbody></table>
        </article>
        <article className="admin-card">
          <h3>Top Technicians</h3>
          {metrics.topTechnicians.map((tech) => <p key={tech.id}>{tech.name} <b>{tech.appointments} bookings</b></p>)}
        </article>
        <article className="admin-card">
          <h3>Top Services</h3>
          {metrics.topServices.slice(0, 5).map((service) => <p key={service.id}>{service.name} <b>{service.count}</b></p>)}
        </article>
        <article className="admin-card">
          <h3>Inventory Alerts</h3>
          {metrics.inventoryAlerts.map((item) => <p key={item.id}>{item.name} <b>{item.currentStock} left</b></p>)}
        </article>
        <article className="admin-card">
          <h3>At a Glance</h3>
          <p>{services.length} active services</p>
          <p>{technicians.length} technicians</p>
          <p>{bookings.length} total bookings</p>
        </article>
      </section>
    </div>
  );
}
