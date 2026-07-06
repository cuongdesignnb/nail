"use client";

import { Facebook, Instagram, Music2, Play, Youtube } from "lucide-react";
import type { NavigationMenuItem } from "@/lib/navigation/navigation.types";
import { inferSocialIcon } from "@/lib/navigation/navigation.validation";

const platforms = [
  { label: "Instagram", icon: Instagram },
  { label: "Facebook", icon: Facebook },
  { label: "TikTok", icon: Music2 },
  { label: "Pinterest", icon: Play },
  { label: "YouTube", icon: Youtube },
  { label: "WhatsApp", icon: Play },
];

export function MenuSocialLinkEditor({ item, onChange }: { item: NavigationMenuItem; onChange: (patch: Partial<NavigationMenuItem>) => void }) {
  const detected = inferSocialIcon(item.href || "");
  const active = item.icon || detected || item.label;
  const ActiveIcon = platforms.find((platform) => platform.label.toLowerCase() === String(active).toLowerCase())?.icon || Instagram;

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[var(--admin-border)]/50 bg-[var(--admin-canvas)] p-4">
        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[var(--admin-muted)]">Platform</p>
        <div className="grid grid-cols-2 gap-2">
          {platforms.map(({ label, icon: Icon }) => (
            <button
              type="button"
              key={label}
              onClick={() => onChange({ label, icon: label, type: "external", target: "_blank", children: [] })}
              className={`flex min-h-11 items-center gap-2 rounded-xl border px-3 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 ${active === label ? "border-[var(--admin-accent)] bg-[var(--admin-accent)]/10 text-[var(--admin-ink)]" : "border-[var(--admin-border)]/50 bg-white text-[var(--admin-muted)] hover:bg-[var(--admin-surface-hover)]"}`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-[var(--admin-muted)]">Social URL</span>
        <input
          value={item.href || ""}
          onChange={(event) => onChange({ href: event.target.value, icon: inferSocialIcon(event.target.value) || item.icon, type: "external", target: "_blank" })}
          placeholder="https://www.instagram.com/aeranails"
          className="mt-2 min-h-11 w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 text-sm text-[var(--admin-ink)] outline-none focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/15"
        />
      </label>

      <div className="flex items-center gap-3 rounded-2xl border border-[var(--admin-border)]/40 bg-white p-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--admin-accent)]/10 text-[var(--admin-accent)]">
          <ActiveIcon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-[var(--admin-ink)]">{active || "Social profile"}</p>
          <p className="text-xs text-[var(--admin-muted)]">Icon preview updates from platform or hostname.</p>
        </div>
      </div>
    </div>
  );
}
