import { AdminTablePage } from "@/components/admin/AdminTablePage";
import { packages } from "@/lib/data";

export default function AdminPackagesPage() {
  return <AdminTablePage title="Packages" copy="Bundle services, set discounts and feature popular packages." headers={["Name", "Duration", "Price", "Featured"]} rows={packages.map((pkg) => [pkg.name, `${pkg.duration} min`, `$${pkg.price}`, pkg.featured ? "Yes" : "No"])} />;
}
