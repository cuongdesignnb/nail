"use client";

import { useState } from "react";
import { ChevronDown, Menu, Phone, X } from "lucide-react";
import type { NavigationLocation, NavigationMenuItem } from "@/lib/navigation/navigation.types";

const tabs = ["Desktop Header", "Mobile Header", "Footer Desktop", "Footer Mobile"] as const;

export function MenuPreviewPanel({ location, items }: { location: NavigationLocation; items: NavigationMenuItem[] }) {
  const defaultTab = location.startsWith("footer_") ? "Footer Desktop" : location === "header_mobile" ? "Mobile Header" : "Desktop Header";
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>(defaultTab);
  const visibleItems = visible(items);

  return (
    <section className="rounded-3xl border border-aera-champagne/40 bg-white/90 p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl text-aera-ink">Live Preview</h2>
          <p className="text-xs text-aera-muted">Draft data only. Public navigation changes after publish.</p>
        </div>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">Draft Preview</span>
      </div>

      <div role="tablist" aria-label="Menu preview modes" className="mb-4 grid grid-cols-2 gap-2">
        {tabs.map((tab) => (
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`min-h-10 rounded-xl px-3 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40 ${activeTab === tab ? "bg-aera-accent text-white" : "bg-aera-ivory text-aera-muted hover:bg-aera-champagne/30"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Desktop Header" && <DesktopHeaderPreview items={visibleItems} />}
      {activeTab === "Mobile Header" && <MobileHeaderPreview items={visibleItems} />}
      {activeTab === "Footer Desktop" && <FooterDesktopPreview location={location} items={visibleItems} />}
      {activeTab === "Footer Mobile" && <FooterMobilePreview location={location} items={visibleItems} />}
    </section>
  );
}

function DesktopHeaderPreview({ items }: { items: NavigationMenuItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-aera-champagne/50 bg-aera-ivory">
      <div className="flex items-center gap-4 border-b border-aera-champagne/40 bg-white px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-aera-accent/10 font-heading text-lg text-aera-accent">A</div>
        <div className="font-heading text-lg text-aera-ink">Aera Nail Lounge</div>
        <nav className="ml-auto flex flex-wrap justify-end gap-3 text-xs font-bold uppercase tracking-wider text-aera-muted">
          {items.slice(0, 7).map((item) => (
            <span key={item.id} className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-aera-champagne/30">
              {item.label}
              {!!item.children?.length && <ChevronDown className="h-3 w-3" />}
            </span>
          ))}
        </nav>
        <span className="rounded-full bg-aera-ink px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white">Book Now</span>
      </div>
      {items.find((item) => item.children?.length) && (
        <div className="mx-auto my-4 max-w-sm rounded-2xl border border-aera-champagne/50 bg-white p-3 shadow-lg">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-aera-muted">Dropdown preview</p>
          <div className="grid gap-1">
            {visible(items.find((item) => item.children?.length)?.children || []).map((child) => (
              <span key={child.id} className="rounded-xl px-3 py-2 text-sm font-semibold text-aera-ink hover:bg-aera-ivory">{child.label}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MobileHeaderPreview({ items }: { items: NavigationMenuItem[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-aera-champagne/50 bg-aera-ink text-white">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="font-heading text-lg">Aera Nail Lounge</div>
        <Menu className="h-5 w-5" />
      </div>
      <div className="ml-auto min-h-[360px] w-[86%] border-l border-white/10 bg-[#fffaf4] p-4 text-aera-ink shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-heading text-xl">Menu</span>
          <X className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="rounded-2xl border border-aera-champagne/50 bg-white p-3">
              <div className="flex items-center justify-between text-sm font-bold">
                {item.label}
                {!!item.children?.length && <ChevronDown className="h-4 w-4" />}
              </div>
              {!!item.children?.length && (
                <div className="mt-2 space-y-1 border-t border-aera-champagne/30 pt-2">
                  {visible(item.children).map((child) => <div key={child.id} className="text-xs text-aera-muted">{child.label}</div>)}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-full bg-aera-accent px-4 py-3 text-center text-xs font-bold uppercase tracking-wider text-white">Book Appointment</div>
      </div>
    </div>
  );
}

function FooterDesktopPreview({ location, items }: { location: NavigationLocation; items: NavigationMenuItem[] }) {
  return (
    <div className="rounded-2xl border border-aera-champagne/50 bg-[#fbf1e3] p-5">
      <div className="grid gap-5 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1.1fr]">
        <div>
          <div className="font-heading text-xl text-aera-ink">Aera Nail Lounge</div>
          <p className="mt-3 text-sm leading-6 text-aera-muted">Elevating your beauty with luxury nail care and heartfelt hospitality.</p>
        </div>
        <PreviewColumn title={locationLabel(location, "Company")} items={location === "footer_company" ? items : sampleLinks("Company")} />
        <PreviewColumn title={locationLabel(location, "Services")} items={location === "footer_services" ? items : sampleLinks("Services")} />
        <PreviewColumn title={locationLabel(location, "Explore")} items={location === "footer_explore" ? items : sampleLinks("Explore")} />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-aera-ink">Contact</p>
          <div className="mt-3 space-y-2 text-sm text-aera-muted">
            <p className="flex gap-2"><Phone className="h-4 w-4" /> (626) 555-7800</p>
            <p>123 Luxe Ave, Suite 100</p>
            <div className="flex gap-2 pt-2">
              {(location === "footer_social" ? items : sampleLinks("Social")).map((item) => <span key={item.id} className="flex h-9 w-9 items-center justify-center rounded-full border border-aera-champagne/70 text-xs">{item.label.slice(0, 1)}</span>)}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap justify-between gap-3 border-t border-aera-champagne/60 pt-4 text-xs text-aera-muted">
        <span>© 2025 Aera Nail Lounge. All Rights Reserved.</span>
        <div className="flex flex-wrap gap-3">{(location === "footer_legal" ? items : sampleLinks("Legal")).map((item) => <span key={item.id}>{item.label}</span>)}</div>
      </div>
    </div>
  );
}

function FooterMobilePreview({ location, items }: { location: NavigationLocation; items: NavigationMenuItem[] }) {
  const active = items.length ? items : sampleLinks("Mobile");
  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-aera-champagne/50 bg-[#fbf1e3] p-5">
      <div className="font-heading text-xl text-aera-ink">Aera Nail Lounge</div>
      <p className="mt-2 text-sm text-aera-muted">Luxury nail care, artistry, and hospitality.</p>
      <div className="mt-5 rounded-2xl bg-white p-4 text-sm text-aera-muted">
        <p className="font-bold text-aera-ink">Contact</p>
        <p className="mt-2">(626) 555-7800</p>
        <p>Mon - Sun: 10:00 AM - 8:00 PM</p>
      </div>
      <div className="mt-4 space-y-2">
        <div className="rounded-2xl border border-aera-champagne/50 bg-white p-4">
          <div className="flex items-center justify-between text-sm font-bold text-aera-ink">
            {locationLabel(location, "Footer Links")}
            <ChevronDown className="h-4 w-4" />
          </div>
          <div className="mt-3 grid gap-2 text-sm text-aera-muted">
            {active.map((item) => <span key={item.id}>{item.label}</span>)}
          </div>
        </div>
      </div>
      <div className="mt-4 flex gap-2">{sampleLinks("Social").map((item) => <span key={item.id} className="flex h-10 w-10 items-center justify-center rounded-full border border-aera-champagne/70 text-xs">{item.label.slice(0, 1)}</span>)}</div>
      <p className="mt-5 border-t border-aera-champagne/60 pt-4 text-xs text-aera-muted">© 2025 Aera Nail Lounge</p>
    </div>
  );
}

function PreviewColumn({ title, items }: { title: string; items: NavigationMenuItem[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-aera-ink">{title}</p>
      <div className="mt-3 grid gap-2 text-sm text-aera-muted">
        {items.map((item) => <span key={item.id}>{item.label}</span>)}
      </div>
    </div>
  );
}

function visible(items: NavigationMenuItem[]) {
  return Array.isArray(items) ? items.filter((item) => item.isEnabled !== false) : [];
}

function sampleLinks(kind: string): NavigationMenuItem[] {
  return ["Home", "Services", "Gallery"].map((label, index) => ({
    id: `${kind}-${index}`,
    label,
    href: "/",
    type: "internal",
    target: "_self",
    isEnabled: true,
    children: [],
  }));
}

function locationLabel(location: NavigationLocation, fallback: string) {
  const labels: Record<NavigationLocation, string> = {
    header_primary: "Header",
    header_mobile: "Mobile",
    footer_company: "Company",
    footer_services: "Services",
    footer_explore: "Explore",
    footer_legal: "Legal",
    footer_social: "Social",
  };
  return labels[location] || fallback;
}
