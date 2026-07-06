"use client";

import React, { useState } from "react";
import {
  Bot, Building2, Clock, CreditCard, FileText, Palette, Search, Settings,
} from "lucide-react";
import { AdminPageHeader, AdminTabs } from "@/components/admin/ui";
import SalonInfoSettings from "./SalonInfoSettings";
import BusinessHoursSettings from "./BusinessHoursSettings";
import BookingPolicySettings from "./BookingPolicySettings";
import BrandingSettings from "./BrandingSettings";
import PaymentSettings from "./PaymentSettings";
import AiContentSettings from "./AiContentSettings";
import SeoSiteSettings from "./SeoSiteSettings";

const SETTINGS_TABS = [
  { key: "salon", label: "Salon Info", icon: Building2 },
  { key: "hours", label: "Business Hours", icon: Clock },
  { key: "policies", label: "Booking Policies", icon: FileText },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "ai-content", label: "AI Content", icon: Bot },
  { key: "branding", label: "Branding", icon: Palette },
  { key: "seo", label: "SEO & Search Visibility", icon: Search },
  { key: "general", label: "General", icon: Settings },
];

export default function SettingsDashboard() {
  const [activeTab, setActiveTab] = useState("salon");

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="System"
        title="Settings"
        description="Salon information, business hours, booking policies, branding and general configuration."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Settings" },
        ]}
      />

      <AdminTabs tabs={SETTINGS_TABS} activeKey={activeTab} onChange={setActiveTab}>
        {activeTab === "salon" && <SalonInfoSettings />}
        {activeTab === "hours" && <BusinessHoursSettings />}
        {activeTab === "policies" && <BookingPolicySettings />}
        {activeTab === "payments" && <PaymentSettings />}
        {activeTab === "ai-content" && <AiContentSettings />}
        {activeTab === "branding" && <BrandingSettings />}
        {activeTab === "seo" && <SeoSiteSettings />}
        {activeTab === "general" && <GeneralSettings />}
      </AdminTabs>
    </div>
  );
}

function GeneralSettings() {
  const [timezone, setTimezone] = useState("America/Los_Angeles");
  const [currency, setCurrency] = useState("USD");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/settings");
        const json = await res.json();
        if (json.success && json.data) {
          setTimezone(json.data.timezone || "America/Los_Angeles");
          setCurrency(json.data.currency || "USD");
        }
      } catch {}
    }
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ timezone, currency }),
      });
      const json = await res.json();
      if (json.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error("Save settings error:", err);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-6 space-y-5">
        <h3 className="text-sm font-bold text-[var(--admin-ink)]">General Settings</h3>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[var(--admin-ink)]">Timezone</label>
          <select value={timezone} onChange={(e) => setTimezone(e.target.value)} className={inputClass}>
            <option value="America/Los_Angeles">Pacific Time (LA)</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="Asia/Ho_Chi_Minh">Vietnam (ICT)</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[var(--admin-ink)]">Currency</label>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className={inputClass}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="VND">VND (₫)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[var(--admin-accent-hover)] disabled:opacity-40"
        >
          {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
