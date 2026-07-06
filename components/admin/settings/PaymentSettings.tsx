"use client";

import React from "react";
import { CheckCircle2, Copy, EyeOff, ShieldCheck, TestTube2, XCircle } from "lucide-react";

type PayPalSettings = {
  isEnabled: boolean;
  environment: "sandbox" | "live";
  clientId: string | null;
  maskedClientId: string | null;
  clientSecretConfigured: boolean;
  webhookId: string | null;
  currency: string;
  chargeMode: "deposit" | "full";
  depositPercentage: number;
  bookingHoldMinutes: number;
  autoConfirmAfterPayment: boolean;
  ready: boolean;
};

const inputClass =
  "w-full rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2.5 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

export default function PaymentSettings() {
  const [settings, setSettings] = React.useState<PayPalSettings | null>(null);
  const [clientSecret, setClientSecret] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [testing, setTesting] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [error, setError] = React.useState("");

  const webhookEndpoint =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/gift-cards/paypal/webhook`
      : "/api/gift-cards/paypal/webhook";

  const load = React.useCallback(async () => {
    const res = await fetch("/api/admin/settings/payments/paypal", { cache: "no-store" });
    const json = await res.json();
    if (json.success) setSettings(json.data);
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

  async function save() {
    if (!settings) return;
    setSaving(true);
    setMessage("");
    setError("");
    const res = await fetch("/api/admin/settings/payments/paypal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...settings, clientSecret: clientSecret.trim() || undefined }),
    });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      setSettings(json.data);
      setClientSecret("");
      setMessage("PayPal settings saved.");
    } else {
      setError(json.error || "Unable to save PayPal settings.");
    }
  }

  async function testConnection() {
    setTesting(true);
    setMessage("");
    setError("");
    const res = await fetch("/api/admin/settings/payments/paypal/test", { method: "POST" });
    const json = await res.json();
    setTesting(false);
    if (json.success) setMessage("PayPal connection succeeded.");
    else setError(json.error || "PayPal connection failed.");
  }

  async function disableAndRemoveSecret() {
    setSaving(true);
    setMessage("");
    setError("");
    const res = await fetch("/api/admin/settings/payments/paypal/disable", { method: "POST" });
    const json = await res.json();
    setSaving(false);
    if (json.success) {
      setSettings(json.data);
      setClientSecret("");
      setMessage("PayPal disabled and secret removed.");
    } else {
      setError(json.error || "Unable to disable PayPal.");
    }
  }

  if (!settings) {
    return <p className="text-xs text-[var(--admin-muted)]">Loading payment settings...</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[var(--admin-ink)]">PayPal Payments</h3>
            <p className="mt-1 text-xs text-[var(--admin-muted)]">Configure secure PayPal checkout for Gift Card purchases only.</p>
          </div>
          <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${settings.ready ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
            {settings.ready ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
            {settings.ready ? `${settings.environment} ready` : "Not ready"}
          </div>
        </div>

        {message && <p className="rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">{message}</p>}
        {error && <p className="rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">{error}</p>}

        <label className="flex items-center gap-2 text-xs font-semibold text-[var(--admin-ink)]">
          <input
            type="checkbox"
            checked={settings.isEnabled}
            onChange={(e) => setSettings({ ...settings, isEnabled: e.target.checked })}
          />
          Enable PayPal Payments
        </label>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="space-y-1.5 text-xs font-semibold text-[var(--admin-ink)]">
            Environment
            <select className={inputClass} value={settings.environment} onChange={(e) => setSettings({ ...settings, environment: e.target.value as "sandbox" | "live" })}>
              <option value="sandbox">Sandbox</option>
              <option value="live">Live</option>
            </select>
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-[var(--admin-ink)]">
            Currency
            <input className={inputClass} value={settings.currency} onChange={(e) => setSettings({ ...settings, currency: e.target.value.toUpperCase() })} />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-[var(--admin-ink)]">
            PayPal Client ID
            <input className={inputClass} value={settings.clientId || ""} onChange={(e) => setSettings({ ...settings, clientId: e.target.value })} />
            {settings.maskedClientId && <span className="text-[10px] text-[var(--admin-muted)]">Saved: {settings.maskedClientId}</span>}
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-[var(--admin-ink)]">
            PayPal Client Secret
            <input className={inputClass} type="password" value={clientSecret} onChange={(e) => setClientSecret(e.target.value)} placeholder={settings.clientSecretConfigured ? "Secret configured - leave blank to keep" : "Paste client secret"} />
            <span className="flex items-center gap-1 text-[10px] text-[var(--admin-muted)]"><EyeOff size={11} /> Secret is write-only and encrypted at rest.</span>
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-[var(--admin-ink)]">
            Webhook ID
            <input className={inputClass} value={settings.webhookId || ""} onChange={(e) => setSettings({ ...settings, webhookId: e.target.value })} />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-[var(--admin-ink)]">
            Charge Mode
            <select className={inputClass} value={settings.chargeMode} onChange={(e) => setSettings({ ...settings, chargeMode: e.target.value as "deposit" | "full" })}>
              <option value="deposit">Deposit</option>
              <option value="full">Full Payment</option>
            </select>
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-[var(--admin-ink)]">
            Deposit Percentage
            <input className={inputClass} type="number" min={1} max={100} value={settings.depositPercentage} onChange={(e) => setSettings({ ...settings, depositPercentage: Number(e.target.value) })} disabled={settings.chargeMode === "full"} />
          </label>
          <label className="space-y-1.5 text-xs font-semibold text-[var(--admin-ink)]">
            Booking Hold Minutes
            <input className={inputClass} type="number" min={5} max={120} value={settings.bookingHoldMinutes} onChange={(e) => setSettings({ ...settings, bookingHoldMinutes: Number(e.target.value) })} />
          </label>
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-[var(--admin-ink)]">
          <input
            type="checkbox"
            checked={settings.autoConfirmAfterPayment}
            onChange={(e) => setSettings({ ...settings, autoConfirmAfterPayment: e.target.checked })}
          />
          Gift Card orders are issued after successful payment
        </label>

        <div className="rounded-xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-4 text-xs text-[var(--admin-ink)]">
          <div className="mb-2 flex items-center gap-2 font-bold"><ShieldCheck size={14} /> Webhook Setup</div>
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded-lg bg-white px-2 py-1 text-[11px]">{webhookEndpoint}</code>
            <button type="button" className="rounded-lg border px-2 py-1" onClick={() => navigator.clipboard?.writeText(webhookEndpoint)}>
              <Copy size={13} />
            </button>
          </div>
          <p className="mt-2 text-[11px] text-[var(--admin-muted)]">Required events: PAYMENT.CAPTURE.COMPLETED, DENIED, REFUNDED, REVERSED.</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={save} disabled={saving} className="rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-[var(--admin-accent-hover)] disabled:opacity-40">
            {saving ? "Saving..." : "Save Payments"}
          </button>
          <button type="button" onClick={testConnection} disabled={testing} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--admin-border)] px-5 py-2 text-xs font-bold text-[var(--admin-ink)] hover:border-[var(--admin-accent)] disabled:opacity-40">
            <TestTube2 size={13} /> {testing ? "Testing..." : "Test Connection"}
          </button>
          <button type="button" onClick={disableAndRemoveSecret} disabled={saving} className="rounded-full border border-rose-200 px-5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-40">
            Disable & Remove Secret
          </button>
        </div>
      </div>
    </div>
  );
}
