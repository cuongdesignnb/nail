import { AdminTablePage } from "@/components/admin/AdminTablePage";
import { getBookings } from "@/lib/store";

export default async function AdminCustomersPage() {
  const bookings = await getBookings();
  const customers = Array.from(new Map(bookings.map((booking) => [booking.customer.email, booking.customer])).values());
  return <AdminTablePage title="Customers" copy="Customer profiles, booking history, spend and notes." headers={["Name", "Email", "Phone", "Type", "Marketing"]} rows={customers.map((customer) => [`${customer.firstName} ${customer.lastName}`, customer.email, customer.phone, customer.type, customer.reminderConsent ? "Opted in" : "No"])} />;
}
