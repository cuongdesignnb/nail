import { AdminSectionCard } from "@/components/admin/ui";
import type { NavigationMenuItem } from "@/lib/navigation/navigation.types";

function visible(items: NavigationMenuItem[]) {
  return items.filter((item) => item.isEnabled !== false);
}

export function MenuPreviewPanel({ location, items }: { location: string; items: NavigationMenuItem[] }) {
  const footer = location.startsWith("footer_");
  const mobile = location === "header_mobile";
  return (
    <AdminSectionCard title={footer ? "Footer Preview" : mobile ? "Mobile Drawer Preview" : "Desktop Header Preview"}>
      <div className="mb-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">Draft Preview</span>
        {footer && <span className="rounded-full bg-aera-champagne/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-aera-ink">Footer Desktop</span>}
        {footer && <span className="rounded-full bg-aera-champagne/40 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-aera-ink">Footer Mobile</span>}
      </div>

      {footer ? (
        <div className="space-y-4 rounded-xl bg-aera-ink p-4 text-white">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">Brand Area</p>
            <h3 className="font-heading text-xl">Aera Nail Lounge</h3>
            <p className="mt-1 text-xs text-white/70">Contact and newsletter content remains managed in Global Content.</p>
          </div>
          <div className="rounded-lg border border-white/10 p-3">
            <p className="mb-2 text-[10px] uppercase tracking-wider text-white/50">Dynamic Footer Menu Column</p>
            <PreviewList items={visible(items)} />
          </div>
          <div className="rounded-lg border border-white/10 p-3 text-xs text-white/70">
            Social icons, legal row and copyright render from the configured footer locations.
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-aera-champagne/40 bg-white p-4">
          <PreviewList items={visible(items)} />
        </div>
      )}
    </AdminSectionCard>
  );
}

function PreviewList({ items }: { items: NavigationMenuItem[] }) {
  if (!items.length) return <p className="text-xs text-aera-muted">No enabled items in this draft.</p>;
  return (
    <ul className="space-y-2 text-sm">
      {items.map((item) => (
        <li key={item.id}>
          <span>{item.label}</span>
          {item.href && <span className="ml-2 text-xs opacity-60">{item.href}</span>}
          {item.children?.length ? (
            <ul className="ml-4 mt-2 space-y-1 text-xs opacity-75">
              {visible(item.children).map((child) => (
                <li key={child.id}>{child.label} {child.href && <span className="opacity-60">{child.href}</span>}</li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
