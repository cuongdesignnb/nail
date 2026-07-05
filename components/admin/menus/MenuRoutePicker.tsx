"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export type RouteSuggestion = {
  group: string;
  label: string;
  href: string;
  routeKey: string;
};

const suggestions: RouteSuggestion[] = [
  { group: "Core Pages", label: "Home", href: "/", routeKey: "home" },
  { group: "Core Pages", label: "About Aera", href: "/about", routeKey: "about" },
  { group: "Core Pages", label: "All Services", href: "/services", routeKey: "services" },
  { group: "Core Pages", label: "Gallery", href: "/gallery", routeKey: "gallery" },
  { group: "Core Pages", label: "Packages", href: "/packages", routeKey: "packages" },
  { group: "Core Pages", label: "Promotions", href: "/promotions", routeKey: "promotions" },
  { group: "Core Pages", label: "Beauty Journal", href: "/blog", routeKey: "blog" },
  { group: "Core Pages", label: "Contact", href: "/contact", routeKey: "contact" },
  { group: "Core Pages", label: "Book Your Appointment", href: "/booking", routeKey: "booking" },
  { group: "Services", label: "Classic Manicure", href: "/services/classic-manicure", routeKey: "service-classic-manicure" },
  { group: "Services", label: "Luxury Manicure", href: "/services/luxury-manicure", routeKey: "service-luxury-manicure" },
  { group: "Services", label: "Classic Pedicure", href: "/services/classic-pedicure", routeKey: "service-classic-pedicure" },
  { group: "Packages", label: "Nail Packages", href: "/packages", routeKey: "packages-main" },
  { group: "Promotions", label: "Current Promotions", href: "/promotions", routeKey: "promotions-main" },
  { group: "Gallery Collections", label: "Nail Art Gallery", href: "/gallery", routeKey: "gallery-main" },
  { group: "Blog Articles", label: "Beauty Journal", href: "/blog", routeKey: "blog-main" },
];

export function MenuRoutePicker({ value, onSelect }: { value?: string; onSelect: (route: RouteSuggestion) => void }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(!value);
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return suggestions.filter((item) => !q || `${item.group} ${item.label} ${item.href}`.toLowerCase().includes(q));
  }, [query]);
  const grouped = useMemo(() => {
    return filtered.reduce<Record<string, RouteSuggestion[]>>((acc, item) => {
      acc[item.group] = [...(acc[item.group] || []), item];
      return acc;
    }, {});
  }, [filtered]);
  const selected = suggestions.find((item) => item.href === value);

  return (
    <div className="relative">
      {selected && !open ? (
        <div className="rounded-2xl border border-aera-champagne/60 bg-white p-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-aera-muted">Selected destination</p>
          <div className="mt-2 flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-aera-ink">{selected.label}</p>
              <p className="truncate text-xs text-aera-muted">{selected.href}</p>
            </div>
            <button type="button" onClick={() => setOpen(true)} className="shrink-0 rounded-full border border-aera-champagne/60 px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-aera-ink hover:bg-aera-champagne/20">
              Change
            </button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className="flex min-h-12 w-full items-center gap-2 rounded-2xl border border-dashed border-aera-champagne/70 bg-white px-4 text-left text-sm font-semibold text-aera-muted hover:border-aera-accent/50 hover:bg-aera-champagne/10">
          <Search className="h-4 w-4" />
          Search destination
        </button>
      )}

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 rounded-2xl border border-aera-champagne/60 bg-white p-3 shadow-2xl">
          <label className="flex min-h-11 items-center gap-2 rounded-xl border border-aera-champagne/40 bg-aera-ivory px-3">
            <Search className="h-4 w-4 text-aera-muted" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search pages, services, packages or articles..."
              className="min-w-0 flex-1 bg-transparent text-sm text-aera-ink outline-none placeholder:text-aera-muted"
            />
          </label>
          <div className="mt-3 max-h-[320px] space-y-3 overflow-y-auto pr-1">
            {Object.entries(grouped).map(([group, routes]) => (
              <div key={group}>
                <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-aera-muted">{group}</p>
                <div className="space-y-1">
                  {routes.map((route) => (
                    <button
                      type="button"
                      key={route.routeKey}
                      onClick={() => {
                        onSelect(route);
                        setOpen(false);
                        setQuery("");
                      }}
                      className={`w-full rounded-xl px-3 py-2 text-left transition hover:bg-aera-champagne/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40 ${value === route.href ? "bg-aera-accent/10 ring-1 ring-aera-accent/30" : "bg-white"}`}
                    >
                      <span className="block text-sm font-bold text-aera-ink">{route.label}</span>
                      <span className="block text-[11px] text-aera-muted">{route.href}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setOpen(false)} className="mt-3 w-full rounded-xl border border-aera-champagne/50 py-2 text-xs font-bold uppercase tracking-wider text-aera-muted hover:bg-aera-champagne/15">
            Close
          </button>
        </div>
      )}
      </div>
  );
}
