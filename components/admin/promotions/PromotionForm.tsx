"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail, MonitorSmartphone, Save, Ticket, WandSparkles } from "lucide-react";
import { AdminFormField, AdminPageHeader, AdminSectionCard, AdminToggle } from "@/components/admin/ui";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";

type CampaignFormData = {
  title: string;
  subtitle: string;
  eyebrow: string;
  badge: string;
  description: string;
  policyNote: string;
  ctaLabel: string;
  imageUrl: string;
  status: "DRAFT" | "ACTIVE" | "PAUSED" | "EXPIRED";
  displayLocation: "HOMEPAGE" | "PROMOTIONS_PAGE" | "POPUP" | "ALL";
  showOnHomepage: boolean;
  popupEnabled: boolean;
  triggerType: "SCROLL_PERCENT" | "SECTION_VISIBLE" | "DELAY_ONLY";
  scrollPercent: number;
  delaySeconds: number;
  frequencyHours: number;
  startDate: string;
  endDate: string;
  sortOrder: number;
  voucher: {
    discountType: "PERCENT" | "FIXED_AMOUNT" | "FREE_ADDON" | "CUSTOM";
    discountValue: number | "";
    codePrefix: string;
    expiresInDays: number;
    usageLimit: number;
    perCustomerLimit: number;
    minimumSpend: number | "";
  };
  email: {
    subject: string;
    preheader: string;
    bodyHtml: string;
    bodyText: string;
    buttonLabel: string;
    buttonUrl: string;
  };
};

const DEFAULT_EMAIL = `<p>Hi {{customerName}},</p>
<p>Thank you for your interest in {{campaignTitle}}.</p>
<p>Your voucher code is:</p>
<h2>{{voucherCode}}</h2>
<p><strong>Offer:</strong><br />{{offerSummary}}</p>
<p><strong>Valid until:</strong><br />{{expiresAt}}</p>
<p><a href="{{bookingUrl}}">Book your appointment</a></p>`;

const EMPTY: CampaignFormData = {
  title: "",
  subtitle: "",
  eyebrow: "",
  badge: "",
  description: "",
  policyNote: "",
  ctaLabel: "Send My Voucher",
  imageUrl: "",
  status: "DRAFT",
  displayLocation: "ALL",
  showOnHomepage: true,
  popupEnabled: false,
  triggerType: "SCROLL_PERCENT",
  scrollPercent: 40,
  delaySeconds: 3,
  frequencyHours: 24,
  startDate: "",
  endDate: "",
  sortOrder: 0,
  voucher: {
    discountType: "PERCENT",
    discountValue: 10,
    codePrefix: "AERA-OFFER",
    expiresInDays: 14,
    usageLimit: 1,
    perCustomerLimit: 1,
    minimumSpend: "",
  },
  email: {
    subject: "Your Aera Nail Lounge Voucher Is Here",
    preheader: "Your limited-time Aera offer is ready.",
    bodyHtml: DEFAULT_EMAIL,
    bodyText: "",
    buttonLabel: "Book Your Appointment",
    buttonUrl: "/booking",
  },
};

function dateInput(value?: string | null) {
  return value ? new Date(value).toISOString().slice(0, 10) : "";
}

function mapCampaign(data: any): CampaignFormData {
  return {
    ...EMPTY,
    title: data.title || "",
    subtitle: data.subtitle || "",
    eyebrow: data.eyebrow || "",
    badge: data.badge || "",
    description: data.description || "",
    policyNote: data.policyNote || "",
    ctaLabel: data.ctaLabel || "Send My Voucher",
    imageUrl: data.imageUrl || "",
    status: data.status || "DRAFT",
    displayLocation: data.displayLocation || "ALL",
    showOnHomepage: data.showOnHomepage ?? true,
    popupEnabled: data.popupEnabled ?? false,
    triggerType: data.triggerType || "SCROLL_PERCENT",
    scrollPercent: data.scrollPercent ?? 40,
    delaySeconds: data.delaySeconds ?? 3,
    frequencyHours: data.frequencyHours ?? 24,
    startDate: dateInput(data.startDate),
    endDate: dateInput(data.endDate),
    sortOrder: data.sortOrder ?? 0,
    voucher: {
      ...EMPTY.voucher,
      discountType: data.voucherTemplate?.discountType || "PERCENT",
      discountValue: data.voucherTemplate?.discountValue ? Number(data.voucherTemplate.discountValue) : "",
      codePrefix: data.voucherTemplate?.codePrefix || "AERA-OFFER",
      expiresInDays: data.voucherTemplate?.expiresInDays ?? 14,
      usageLimit: data.voucherTemplate?.usageLimit ?? 1,
      perCustomerLimit: data.voucherTemplate?.perCustomerLimit ?? 1,
      minimumSpend: data.voucherTemplate?.minimumSpend ? Number(data.voucherTemplate.minimumSpend) : "",
    },
    email: {
      ...EMPTY.email,
      subject: data.emailTemplate?.subject || EMPTY.email.subject,
      preheader: data.emailTemplate?.preheader || "",
      bodyHtml: data.emailTemplate?.bodyHtml || DEFAULT_EMAIL,
      bodyText: data.emailTemplate?.bodyText || "",
      buttonLabel: data.emailTemplate?.buttonLabel || "Book Your Appointment",
      buttonUrl: data.emailTemplate?.buttonUrl || "/booking",
    },
  };
}

export default function PromotionForm({ promotionId }: { promotionId?: string }) {
  const router = useRouter();
  const isEdit = !!promotionId;
  const [form, setForm] = useState<CampaignFormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!promotionId) return;
    fetch(`/api/admin/promotions/${promotionId}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setForm(mapCampaign(json.data));
      })
      .catch(() => setError("Failed to load promotion campaign."));
  }, [promotionId]);

  const inputClass =
    "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

  function update<K extends keyof CampaignFormData>(field: K, value: CampaignFormData[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError(null);
  }

  function updateVoucher<K extends keyof CampaignFormData["voucher"]>(field: K, value: CampaignFormData["voucher"][K]) {
    setForm((prev) => ({ ...prev, voucher: { ...prev.voucher, [field]: value } }));
    setError(null);
  }

  function updateEmail<K extends keyof CampaignFormData["email"]>(field: K, value: CampaignFormData["email"][K]) {
    setForm((prev) => ({ ...prev, email: { ...prev.email, [field]: value } }));
    setError(null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(isEdit ? `/api/admin/promotions/${promotionId}` : "/api/admin/promotions", {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          voucher: {
            ...form.voucher,
            discountValue: form.voucher.discountValue === "" ? null : Number(form.voucher.discountValue),
            minimumSpend: form.voucher.minimumSpend === "" ? null : Number(form.voucher.minimumSpend),
            codePrefix: form.voucher.codePrefix.toUpperCase(),
          },
        }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Failed to save promotion campaign.");
        return;
      }
      router.push("/admin/promotions");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="admin-page-container max-w-6xl">
      <AdminPageHeader
        eyebrow="Promotions"
        title={isEdit ? "Edit Campaign" : "New Campaign"}
        description="Configure homepage display, popup trigger rules, voucher rules, and voucher email copy."
        breadcrumbs={[
          { label: "Admin", href: "/admin" },
          { label: "Promotions", href: "/admin/promotions" },
          { label: isEdit ? "Edit" : "New" },
        ]}
        actions={
          <button type="button" onClick={() => router.push("/admin/promotions")} className="inline-flex items-center gap-2 rounded-full border border-[var(--admin-border-strong)] bg-white px-4 py-2 text-xs font-bold text-[var(--admin-ink)]">
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-xs text-red-700">{error}</div>}

        <AdminSectionCard title="Campaign Content" icon={WandSparkles} defaultOpen>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AdminFormField label="Title" required><input className={inputClass} value={form.title} onChange={(e) => update("title", e.target.value)} /></AdminFormField>
            <AdminFormField label="Subtitle / Offer Headline"><input className={inputClass} value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} /></AdminFormField>
            <AdminFormField label="Eyebrow"><input className={inputClass} value={form.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} placeholder="WEEKDAY SPECIAL" /></AdminFormField>
            <AdminFormField label="Badge"><input className={inputClass} value={form.badge} onChange={(e) => update("badge", e.target.value)} placeholder="EARLY BIRD" /></AdminFormField>
            <AdminFormField label="CTA Label" required><input className={inputClass} value={form.ctaLabel} onChange={(e) => update("ctaLabel", e.target.value)} /></AdminFormField>
            <AdminFormField label="Sort Order"><input className={inputClass} type="number" value={form.sortOrder} onChange={(e) => update("sortOrder", Number(e.target.value))} /></AdminFormField>
            <div className="md:col-span-2"><AdminFormField label="Description"><textarea className={inputClass} rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} /></AdminFormField></div>
            <div className="md:col-span-2"><AdminFormField label="Policy Note"><input className={inputClass} value={form.policyNote} onChange={(e) => update("policyNote", e.target.value)} /></AdminFormField></div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Display Settings" icon={MonitorSmartphone} defaultOpen>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <AdminFormField label="Status"><select className={inputClass} value={form.status} onChange={(e) => update("status", e.target.value as any)}><option>DRAFT</option><option>ACTIVE</option><option>PAUSED</option><option>EXPIRED</option></select></AdminFormField>
            <AdminFormField label="Location"><select className={inputClass} value={form.displayLocation} onChange={(e) => update("displayLocation", e.target.value as any)}><option>HOMEPAGE</option><option>PROMOTIONS_PAGE</option><option>POPUP</option><option>ALL</option></select></AdminFormField>
            <AdminFormField label="Start Date"><input className={inputClass} type="date" value={form.startDate} onChange={(e) => update("startDate", e.target.value)} /></AdminFormField>
            <AdminFormField label="End Date"><input className={inputClass} type="date" value={form.endDate} onChange={(e) => update("endDate", e.target.value)} /></AdminFormField>
            <AdminFormField label="Scroll Percent"><input className={inputClass} type="number" min={10} max={90} value={form.scrollPercent} onChange={(e) => update("scrollPercent", Number(e.target.value))} /></AdminFormField>
            <AdminFormField label="Delay Seconds"><input className={inputClass} type="number" min={0} max={30} value={form.delaySeconds} onChange={(e) => update("delaySeconds", Number(e.target.value))} /></AdminFormField>
            <AdminFormField label="Frequency Hours"><input className={inputClass} type="number" min={1} max={720} value={form.frequencyHours} onChange={(e) => update("frequencyHours", Number(e.target.value))} /></AdminFormField>
            <AdminFormField label="Trigger Type"><select className={inputClass} value={form.triggerType} onChange={(e) => update("triggerType", e.target.value as any)}><option>SCROLL_PERCENT</option><option>SECTION_VISIBLE</option><option>DELAY_ONLY</option></select></AdminFormField>
            <div className="flex items-center gap-8 pt-6">
              <AdminToggle label="Homepage" checked={form.showOnHomepage} onChange={(value) => update("showOnHomepage", value)} />
              <AdminToggle label="Popup" checked={form.popupEnabled} onChange={(value) => update("popupEnabled", value)} />
            </div>
            <div className="md:col-span-3">
              <MediaPickerField label="Campaign Image" value={form.imageUrl} onChange={(url) => update("imageUrl", url)} folder="promotions" aspectRatio="4/3" />
            </div>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Voucher Rule" icon={Ticket} defaultOpen>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <AdminFormField label="Discount Type"><select className={inputClass} value={form.voucher.discountType} onChange={(e) => updateVoucher("discountType", e.target.value as any)}><option>PERCENT</option><option>FIXED_AMOUNT</option><option>FREE_ADDON</option><option>CUSTOM</option></select></AdminFormField>
            <AdminFormField label="Discount Value"><input className={inputClass} type="number" value={form.voucher.discountValue} onChange={(e) => updateVoucher("discountValue", e.target.value === "" ? "" : Number(e.target.value))} /></AdminFormField>
            <AdminFormField label="Code Prefix" required><input className={inputClass} value={form.voucher.codePrefix} onChange={(e) => updateVoucher("codePrefix", e.target.value.toUpperCase())} /></AdminFormField>
            <AdminFormField label="Expires In Days"><input className={inputClass} type="number" min={1} value={form.voucher.expiresInDays} onChange={(e) => updateVoucher("expiresInDays", Number(e.target.value))} /></AdminFormField>
            <AdminFormField label="Usage Limit"><input className={inputClass} type="number" min={1} value={form.voucher.usageLimit} onChange={(e) => updateVoucher("usageLimit", Number(e.target.value))} /></AdminFormField>
            <AdminFormField label="Minimum Spend"><input className={inputClass} type="number" value={form.voucher.minimumSpend} onChange={(e) => updateVoucher("minimumSpend", e.target.value === "" ? "" : Number(e.target.value))} /></AdminFormField>
          </div>
        </AdminSectionCard>

        <AdminSectionCard title="Email Template" icon={Mail} defaultOpen={false}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <AdminFormField label="Subject"><input className={inputClass} value={form.email.subject} onChange={(e) => updateEmail("subject", e.target.value)} /></AdminFormField>
            <AdminFormField label="Preheader"><input className={inputClass} value={form.email.preheader} onChange={(e) => updateEmail("preheader", e.target.value)} /></AdminFormField>
            <AdminFormField label="Button Label"><input className={inputClass} value={form.email.buttonLabel} onChange={(e) => updateEmail("buttonLabel", e.target.value)} /></AdminFormField>
            <AdminFormField label="Button URL"><input className={inputClass} value={form.email.buttonUrl} onChange={(e) => updateEmail("buttonUrl", e.target.value)} /></AdminFormField>
            <div className="md:col-span-2"><AdminFormField label="Email HTML Body"><textarea className={inputClass} rows={8} value={form.email.bodyHtml} onChange={(e) => updateEmail("bodyHtml", e.target.value)} /></AdminFormField></div>
          </div>
          <p className="mt-3 text-[11px] text-[var(--admin-muted)]">Variables: {"{{customerName}} {{campaignTitle}} {{offerSummary}} {{voucherCode}} {{expiresAt}} {{bookingUrl}}"}</p>
        </AdminSectionCard>

        <button type="submit" disabled={saving || !form.title || !form.ctaLabel} className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50">
          <Save className="h-3.5 w-3.5" />
          {saving ? "Saving..." : isEdit ? "Update Campaign" : "Create Campaign"}
        </button>
      </form>
    </div>
  );
}
