import { AdminTablePage } from "@/components/admin/AdminTablePage";
import { services } from "@/lib/data";

export default function AdminServicesPage() {
  return <AdminTablePage title="Services" copy="Manage categories, duration, price, add-ons and assigned technicians." headers={["Name", "Category", "Duration", "Price", "Active"]} rows={services.map((service) => [service.name, service.category, `${service.duration} min`, `$${service.price}`, "Yes"])} actions={<button className="primary-btn">Add Service</button>} />;
}
