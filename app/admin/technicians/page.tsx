import { AdminTablePage } from "@/components/admin/AdminTablePage";
import { technicians } from "@/lib/data";

export default function AdminTechniciansPage() {
  return <AdminTablePage title="Technicians" copy="Manage availability, capabilities, rating and performance." headers={["Name", "Role", "Specialty", "Rating", "Experience"]} rows={technicians.map((tech) => [tech.name, tech.role, tech.specialty, tech.rating, tech.experience])} actions={<button className="primary-btn">Add Technician</button>} />;
}
