"use client";

import { useState } from "react";
import type { PublicPromotionCampaign } from "@/lib/promotions/promotion.types";

export function PromotionLeadForm({
  campaign,
  onSuccess,
}: {
  campaign: PublicPromotionCampaign;
  onSuccess: (message: string) => void;
}) {
  const [form, setForm] = useState({ fullName: "", email: "", phone: "", consentAccepted: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/promotions/${campaign.id}/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, sourcePage: window.location.pathname }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "We couldn't send your voucher right now. Please try again.");
        return;
      }
      try {
        localStorage.setItem(`aera_promo_popup_claimed_${campaign.id}`, String(Date.now()));
      } catch {}
      onSuccess(json.message);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="promo-lead-form" onSubmit={submit}>
      <label>
        Full Name *
        <input value={form.fullName} onChange={(e) => setForm((prev) => ({ ...prev, fullName: e.target.value }))} required maxLength={100} />
      </label>
      <label>
        Email Address *
        <input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} required maxLength={160} />
      </label>
      <label>
        Phone Number *
        <input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} required maxLength={30} />
      </label>
      <label className="promo-consent">
        <input type="checkbox" checked={form.consentAccepted} onChange={(e) => setForm((prev) => ({ ...prev, consentAccepted: e.target.checked }))} required />
        <span>I agree to receive this offer by email.</span>
      </label>
      {error && <p className="promo-form-error">{error}</p>}
      <button type="submit" className="promo-submit" disabled={loading}>
        {loading ? "Sending..." : campaign.ctaLabel || "Send My Voucher"}
      </button>
    </form>
  );
}
