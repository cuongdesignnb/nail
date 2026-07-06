import { AdminSectionCard } from "@/components/admin/ui";

type Settings = {
  headerMobileMode: "inherit_header_primary" | "custom_menu";
  headerMobileMenuKey: string;
};

export function HeaderMobileMenuSettings({ settings, onChange }: { settings: Settings; onChange: (next: any) => void }) {
  return (
    <AdminSectionCard title="Header Mobile Navigation">
      <div className="space-y-4">
        <p className="text-sm text-[var(--admin-muted)]">
          By default, mobile navigation uses the same menu as the desktop Header. Enable a custom mobile menu only when mobile navigation needs different items or ordering.
        </p>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className={`rounded-xl border p-4 ${settings.headerMobileMode === "inherit_header_primary" ? "border-[var(--admin-accent)] bg-[var(--admin-surface-hover)]" : "border-[var(--admin-border)]/40"}`}>
            <input
              type="radio"
              name="headerMobileMode"
              checked={settings.headerMobileMode === "inherit_header_primary"}
              onChange={() => onChange((prev: Settings) => ({ ...prev, headerMobileMode: "inherit_header_primary" }))}
            />
            <span className="ml-2 text-sm font-bold text-[var(--admin-ink)]">Use Primary Header Menu</span>
          </label>
          <label className={`rounded-xl border p-4 ${settings.headerMobileMode === "custom_menu" ? "border-[var(--admin-accent)] bg-[var(--admin-surface-hover)]" : "border-[var(--admin-border)]/40"}`}>
            <input
              type="radio"
              name="headerMobileMode"
              checked={settings.headerMobileMode === "custom_menu"}
              onChange={() => onChange((prev: Settings) => ({ ...prev, headerMobileMode: "custom_menu", headerMobileMenuKey: "header-mobile" }))}
            />
            <span className="ml-2 text-sm font-bold text-[var(--admin-ink)]">Use Custom Mobile Menu</span>
          </label>
        </div>
        {settings.headerMobileMode === "custom_menu" && (
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[var(--admin-muted)]">Custom Mobile Menu Assignment</label>
            <select
              className="mt-1 w-full rounded-xl border border-[var(--admin-border-strong)] px-3 py-2 text-sm"
              value={settings.headerMobileMenuKey}
              onChange={(event) => onChange((prev: Settings) => ({ ...prev, headerMobileMenuKey: event.target.value }))}
            >
              <option value="header-mobile">Header Mobile Menu</option>
            </select>
          </div>
        )}
      </div>
    </AdminSectionCard>
  );
}
