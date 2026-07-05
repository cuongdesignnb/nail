import Link from "next/link";
import { AdminSectionCard } from "@/components/admin/ui";

const labels: Record<string, string> = {
  footer_company: "Company Links",
  footer_services: "Services Links",
  footer_explore: "Explore Links",
  footer_legal: "Legal Links",
  footer_social: "Social Links",
};

export function FooterMenuAssignments({ menus }: { menus: any[] }) {
  const footerMenus = menus.filter((menu) => menu.location.startsWith("footer_"));
  return (
    <AdminSectionCard title="Footer Menu Assignments">
      <div className="divide-y divide-aera-champagne/30 rounded-xl border border-aera-champagne/40">
        {footerMenus.map((menu) => (
          <div key={menu.key} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-aera-muted">{labels[menu.location] || menu.location}</p>
              <h3 className="text-sm font-bold text-aera-ink">{menu.name}</h3>
              <p className="text-xs text-aera-muted">
                Assigned Menu: {menu.key} - Items: {menu.draftItemCount} - Status: {menu.hasDraftChanges ? "Draft changes" : "Published"}
              </p>
            </div>
            <Link href={`/admin/menus/${menu.key}`} className="rounded-full bg-aera-ink px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
              Open Menu Editor
            </Link>
          </div>
        ))}
      </div>
    </AdminSectionCard>
  );
}
