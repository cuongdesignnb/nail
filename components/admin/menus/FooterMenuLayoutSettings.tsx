import { AdminSectionCard } from "@/components/admin/ui";

type Settings = {
  footerLayout: "two_columns" | "three_columns" | "four_columns";
  footerShowSocial: boolean;
  footerShowLegal: boolean;
};

export function FooterMenuLayoutSettings({ settings, onChange }: { settings: Settings; onChange: (next: any) => void }) {
  return (
    <AdminSectionCard title="Footer Menu Layout">
      <div className="space-y-4">
        <p className="text-sm text-[var(--admin-muted)]">
          Layout only changes responsive column arrangement. It does not delete menu data, and empty menu columns are hidden automatically.
        </p>
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--admin-muted)]">Footer Navigation Layout</label>
          <select
            className="mt-1 w-full rounded-xl border border-[var(--admin-border-strong)] px-3 py-2 text-sm"
            value={settings.footerLayout}
            onChange={(event) => onChange((prev: Settings) => ({ ...prev, footerLayout: event.target.value }))}
          >
            <option value="two_columns">Two Columns</option>
            <option value="three_columns">Three Columns</option>
            <option value="four_columns">Four Columns</option>
          </select>
        </div>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label className="flex items-center gap-2 rounded-xl border border-[var(--admin-border)]/40 p-4 text-sm font-semibold text-[var(--admin-ink)]">
            <input
              type="checkbox"
              checked={settings.footerShowSocial}
              onChange={(event) => onChange((prev: Settings) => ({ ...prev, footerShowSocial: event.target.checked }))}
            />
            Show Footer Social Links
          </label>
          <label className="flex items-center gap-2 rounded-xl border border-[var(--admin-border)]/40 p-4 text-sm font-semibold text-[var(--admin-ink)]">
            <input
              type="checkbox"
              checked={settings.footerShowLegal}
              onChange={(event) => onChange((prev: Settings) => ({ ...prev, footerShowLegal: event.target.checked }))}
            />
            Show Footer Legal Links
          </label>
        </div>
      </div>
    </AdminSectionCard>
  );
}
