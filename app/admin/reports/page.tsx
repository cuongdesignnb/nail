import { AdminTablePage } from "@/components/admin/AdminTablePage";
import { getBookings } from "@/lib/store";

export default async function AdminReportsPage() {
  const bookings = await getBookings();
  return <AdminTablePage title="Reports" copy="Revenue, bookings, technician performance, service performance and inventory exports." headers={["Report", "Records", "Status"]} rows={[
    ["Revenue Report", bookings.length, "Ready"],
    ["Booking Report", bookings.length, "Ready"],
    ["Technician Performance", "4 technicians", "Ready"],
    ["Inventory Report", "4 items", "Ready"]
  ]} actions={<button className="primary-btn">Export CSV</button>} />;
}
