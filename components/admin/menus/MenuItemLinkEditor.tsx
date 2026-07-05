"use client";

import { AtSign, ExternalLink, Link2, Mail, MousePointer2, Phone } from "lucide-react";
import type { ReactNode } from "react";
import type { NavigationLinkType, NavigationMenuItem } from "@/lib/navigation/navigation.types";
import { MenuRoutePicker } from "./MenuRoutePicker";
import { setItemLinkType } from "./menu-tree.utils";

const linkTypes: Array<{ type: NavigationLinkType; label: string; icon: typeof Link2; helper: string }> = [
  { type: "internal", label: "Internal Page", icon: Link2, helper: "Pick a site page" },
  { type: "external", label: "External Link", icon: ExternalLink, helper: "Full URL" },
  { type: "tel", label: "Phone Link", icon: Phone, helper: "Tap to call" },
  { type: "mailto", label: "Email Link", icon: Mail, helper: "Tap to email" },
  { type: "none", label: "Dropdown Label Only", icon: MousePointer2, helper: "Open submenu only" },
];

export function MenuItemLinkEditor({ item, onChange }: { item: NavigationMenuItem; onChange: (patch: Partial<NavigationMenuItem>) => void }) {
  const selectedType = item.type || "internal";

  function updateType(type: NavigationLinkType) {
    const next = setItemLinkType(item, type);
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wider text-aera-muted">Link Type</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {linkTypes.map(({ type, label, icon: Icon, helper }) => (
            <button
              type="button"
              key={type}
              onClick={() => updateType(type)}
              className={`rounded-2xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40 ${selectedType === type ? "border-aera-accent bg-aera-accent/10" : "border-aera-champagne/50 bg-white hover:bg-aera-champagne/20"}`}
            >
              <span className="flex items-center gap-2 text-sm font-bold text-aera-ink">
                <Icon className="h-4 w-4 text-aera-accent" />
                {label}
              </span>
              <span className="mt-1 block text-[11px] text-aera-muted">{helper}</span>
            </button>
          ))}
        </div>
      </div>

      {selectedType === "internal" && (
        <MenuRoutePicker
          value={item.href}
          onSelect={(route) => onChange({ href: route.href, label: item.label?.trim() ? item.label : route.label, type: "internal", target: "_self" })}
        />
      )}

      {selectedType === "external" && (
        <VisualInput label="External URL" value={item.href || ""} placeholder="https://example.com" onChange={(href) => onChange({ href, type: "external", target: "_blank" })} />
      )}

      {selectedType === "tel" && (
        <VisualInput
          label="Phone"
          icon={<Phone className="h-4 w-4 text-aera-muted" />}
          value={(item.href || "").replace(/^tel:/, "")}
          placeholder="(626) 555-7800"
          hint={`Preview: tel:${(item.href || "").replace(/^tel:/, "")}`}
          onChange={(phone) => onChange({ href: phone ? `tel:${phone}` : "", type: "tel", target: "_self" })}
        />
      )}

      {selectedType === "mailto" && (
        <VisualInput
          label="Email"
          icon={<AtSign className="h-4 w-4 text-aera-muted" />}
          value={(item.href || "").replace(/^mailto:/, "")}
          placeholder="hello@aeranailounge.com"
          hint={`Preview: mailto:${(item.href || "").replace(/^mailto:/, "")}`}
          onChange={(email) => onChange({ href: email ? `mailto:${email}` : "", type: "mailto", target: "_self" })}
        />
      )}
    </div>
  );
}

function VisualInput({ label, value, placeholder, hint, icon, onChange }: { label: string; value: string; placeholder?: string; hint?: string; icon?: ReactNode; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wider text-aera-muted">{label}</span>
      <span className="mt-2 flex min-h-11 items-center gap-2 rounded-xl border border-aera-champagne/60 bg-white px-3 focus-within:border-aera-accent focus-within:ring-2 focus-within:ring-aera-accent/15">
        {icon}
        <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-w-0 flex-1 bg-transparent text-sm text-aera-ink outline-none" />
      </span>
      {hint && <span className="mt-1 block text-[11px] text-aera-muted">{hint}</span>}
    </label>
  );
}
