import AdminLayoutClient from "@/components/admin/AdminLayoutClient";
import "@/styles/admin-tokens.css";
import "@/styles/admin-components.css";

export const metadata = {
  title: "Admin — Aera Nail Lounge",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
