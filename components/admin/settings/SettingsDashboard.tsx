"use client";

import React, { useState } from "react";
import {
  Bot, Building2, Clock, CreditCard, FileText, Mail, Palette, Search, Settings,
} from "lucide-react";
import { AdminPageHeader, AdminTabs } from "@/components/admin/ui";
import SalonInfoSettings from "./SalonInfoSettings";
import BusinessHoursSettings from "./BusinessHoursSettings";
import BookingPolicySettings from "./BookingPolicySettings";
import BrandingSettings from "./BrandingSettings";
import PaymentSettings from "./PaymentSettings";
import AiContentSettings from "./AiContentSettings";
import SeoSiteSettings from "./SeoSiteSettings";
import SmtpSettingsForm from "./SmtpSettingsForm";
import { useSettingsForm } from "@/hooks/admin/useSettingsForm";
import { SettingsStatusFooter } from "./SettingsStatusFooter";
import { useToast } from "@/components/admin/ui/AdminToastProvider";
import type { BusinessSettings } from "@/lib/settings/settings.types";

const SETTINGS_TABS = [
  { key: "salon", label: "Salon Info", icon: Building2 },
  { key: "hours", label: "Business Hours", icon: Clock },
  { key: "policies", label: "Booking Policies", icon: FileText },
  { key: "payments", label: "Payments", icon: CreditCard },
  { key: "email", label: "Email & SMTP", icon: Mail },
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
        {activeTab === "email" && <SmtpSettingsForm />}
        {activeTab === "ai-content" && <AiContentSettings />}
        {activeTab === "branding" && <BrandingSettings />}
        {activeTab === "seo" && <SeoSiteSettings />}
        {activeTab === "general" && <GeneralSettings />}
      </AdminTabs>
    </div>
  );
}

function GeneralSettings() {
  const settings = useSettingsForm<BusinessSettings>({ url: "/api/admin/settings/general" });
  const toast = useToast();
  const [paypalCurrency, setPaypalCurrency] = React.useState<string | null>(null);

  React.useEffect(() => {
    settings.load().catch(() => undefined);
    fetch("/api/admin/settings/payments/paypal", { cache: "no-store" }).then((response) => response.json()).then((json) => { if (json.success) setPaypalCurrency(json.data.currency); }).catch(() => undefined);
    // The hook owns load state and keeps failed requests from hydrating defaults.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!settings.data) return;
    const saved = await settings.save();
    saved ? toast.success("General settings saved and verified.") : toast.error(settings.error || "Unable to save general settings.");
  };

  const inputClass =
    "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

  if (settings.loading && !settings.data) return <div className="p-6 text-xs text-[var(--admin-muted)]">Loading general settings...</div>;
  if (settings.error && !settings.data) return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-xs text-red-700">
      <p>Unable to load settings.</p>
      <button type="button" onClick={() => settings.reload().catch(() => undefined)} className="mt-3 font-bold underline">Retry</button>
    </div>
  );
  if (!settings.data) return null;

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-6 space-y-5">
        <h3 className="text-sm font-bold text-[var(--admin-ink)]">General Settings</h3>

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[var(--admin-ink)]">Timezone</label>
          <select value={settings.data.timezone} onChange={(e) => settings.setData({ ...settings.data!, timezone: e.target.value })} className={inputClass}>
            <option value="America/Los_Angeles">Pacific Time (LA)</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="Asia/Ho_Chi_Minh">Vietnam (ICT)</option>
          </select>
        </div>
        {paypalCurrency && paypalCurrency !== settings.data.currency && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">Gift Card PayPal currency is {paypalCurrency}, which differs from the General currency {settings.data.currency}.</p>}

        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[var(--admin-ink)]">Currency</label>
          <select value={settings.data.currency} onChange={(e) => settings.setData({ ...settings.data!, currency: e.target.value })} className={inputClass}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="VND">VND (₫)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={settings.loading || settings.saving || !settings.isDirty}
          className="rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[var(--admin-accent-hover)] disabled:opacity-40"
        >
          {settings.saving ? "Saving..." : "Save Changes"}
        </button>
        <SettingsStatusFooter {...settings} onReload={() => settings.reload().catch(() => undefined)} />
      </div>
    </div>
  );
}
