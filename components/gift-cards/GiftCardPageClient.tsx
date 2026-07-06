"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { BadgeDollarSign, Gift, Heart, Loader2, Sparkles } from "lucide-react";
import { GiftCardPreview } from "./GiftCardPreview";
import type { GiftCardCatalog } from "@/lib/gift-cards/gift-card.types";

function money(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value || 0);
}

export function GiftCardPageClient({ catalog }: { catalog: GiftCardCatalog }) {
  const [type, setType] = useState<"AMOUNT" | "SERVICE">("AMOUNT");
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState("");
  const [categoryId, setCategoryId] = useState(catalog.categories[0]?.id || "");
  const [serviceId, setServiceId] = useState("");
  const [form, setForm] = useState({
    recipientName: "",
    recipientEmail: "",
    senderName: "",
    senderEmail: "",
    message: "",
    termsAccepted: false,
  });
  const [purchaseId, setPurchaseId] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const selectedCategory = catalog.categories.find((category) => category.id === categoryId) || catalog.categories[0];
  const selectedService = catalog.categories.flatMap((category) => category.services).find((service) => service.id === serviceId);
  const activeAmount = type === "AMOUNT" ? Number(customAmount || amount) : selectedService?.price || 0;
  const validEmail = (value: string) => /\S+@\S+\.\S+/.test(value);
  const formValid =
    form.recipientName.trim() &&
    validEmail(form.recipientEmail) &&
    form.senderName.trim() &&
    validEmail(form.senderEmail) &&
    form.message.trim() &&
    form.message.length <= 280 &&
    form.termsAccepted &&
    (type === "SERVICE" ? selectedService : activeAmount >= catalog.settings.minCustomAmount && activeAmount <= catalog.settings.maxCustomAmount);

  const previewValue = useMemo(() => {
    if (type === "SERVICE") return selectedService ? `${selectedService.name} (${money(selectedService.price, catalog.settings.currency)})` : "";
    return money(activeAmount, catalog.settings.currency);
  }, [activeAmount, catalog.settings.currency, selectedService, type]);

  async function ensurePurchase() {
    if (purchaseId) return purchaseId;
    setProcessing(true);
    setError("");
    const res = await fetch("/api/gift-cards/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        amount: type === "AMOUNT" ? activeAmount : undefined,
        serviceId: type === "SERVICE" ? serviceId : undefined,
        ...form,
      }),
    });
    const json = await res.json();
    setProcessing(false);
    if (!json.success) {
      setError(json.error || "Unable to start Gift Card checkout.");
      throw new Error(json.error || "Unable to start Gift Card checkout.");
    }
    setPurchaseId(json.data.purchaseId);
    return json.data.purchaseId as string;
  }

  async function createOrder() {
    const id = await ensurePurchase();
    const res = await fetch("/api/gift-cards/paypal/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseId: id }),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || "Unable to create PayPal order.");
    return json.data.paypalOrderId;
  }

  async function captureOrder(paypalOrderId: string) {
    const id = purchaseId || (await ensurePurchase());
    setProcessing(true);
    const res = await fetch("/api/gift-cards/paypal/capture-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ purchaseId: id, paypalOrderId }),
    });
    const json = await res.json();
    setProcessing(false);
    if (!json.success) {
      setError(json.error || "Payment could not be verified.");
      return;
    }
    window.location.href = `/gift-cards/success?order=${encodeURIComponent(json.data.orderNumber)}`;
  }

  return (
    <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
      <div className="space-y-6">
        <div className="rounded-[24px] border border-[#ead9bd] bg-white/80 p-5 shadow-sm">
          <p className="text-xs uppercase tracking-[0.22em] text-[#9a6a46]">I Would Like to Gift</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { id: "AMOUNT", icon: BadgeDollarSign, title: "Amount", help: "Let them choose any Aera experience." },
              { id: "SERVICE", icon: Sparkles, title: "Service", help: "Gift one curated salon service." },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={type === option.id}
                className={`rounded-2xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-[#9d6f45] ${type === option.id ? "border-[#8b5e3c] bg-[#fff7e7]" : "border-[#ead9bd] bg-white"}`}
                onClick={() => { setType(option.id as "AMOUNT" | "SERVICE"); setPurchaseId(""); }}
              >
                <option.icon className="mb-3 text-[#8b5e3c]" size={22} />
                <b>{option.title}</b>
                <span className="mt-1 block text-sm text-[#725744]">{option.help}</span>
              </button>
            ))}
          </div>
        </div>

        {type === "AMOUNT" ? (
          <div className="rounded-[24px] border border-[#ead9bd] bg-white/80 p-5">
            <h2 className="font-serif text-2xl text-[#3d2d24]">Select an Amount</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {catalog.settings.amountPresetValues.map((preset) => (
                <button key={preset} className={`rounded-full border px-4 py-3 font-semibold ${amount === preset && !customAmount ? "border-[#8b5e3c] bg-[#8b5e3c] text-white" : "border-[#e4cfac] bg-white text-[#4b3528]"}`} onClick={() => { setAmount(preset); setCustomAmount(""); setPurchaseId(""); }}>
                  {money(preset, catalog.settings.currency)}
                </button>
              ))}
            </div>
            <label className="mt-4 block text-sm font-medium text-[#4b3528]">
              Custom Amount
              <input className="mt-2 w-full rounded-2xl border border-[#e4cfac] px-4 py-3" inputMode="numeric" placeholder="Enter amount" value={customAmount} onChange={(event) => { setCustomAmount(event.target.value.replace(/\D/g, "")); setPurchaseId(""); }} />
            </label>
            <p className="mt-2 text-sm text-[#725744]">Minimum {money(catalog.settings.minCustomAmount)}. Maximum {money(catalog.settings.maxCustomAmount)}.</p>
          </div>
        ) : (
          <div className="rounded-[24px] border border-[#ead9bd] bg-white/80 p-5">
            <h2 className="font-serif text-2xl text-[#3d2d24]">Select a Category</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {catalog.categories.map((category) => (
                <button key={category.id} className={`rounded-full border px-4 py-2 ${categoryId === category.id ? "border-[#8b5e3c] bg-[#8b5e3c] text-white" : "border-[#e4cfac] bg-white"}`} onClick={() => { setCategoryId(category.id); setServiceId(""); setPurchaseId(""); }}>{category.name}</button>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {selectedCategory?.services.map((service) => (
                <button key={service.id} className={`w-full rounded-2xl border p-4 text-left ${serviceId === service.id ? "border-[#8b5e3c] bg-[#fff7e7]" : "border-[#ead9bd] bg-white"}`} onClick={() => { setServiceId(service.id); setPurchaseId(""); }}>
                  <span className="flex flex-wrap items-center justify-between gap-2"><b>{service.name}</b><b>{money(service.price, catalog.settings.currency)}</b></span>
                  <span className="mt-1 block text-sm text-[#725744]">{service.description || "A signature Aera salon service."}</span>
                  <span className="mt-2 block text-xs uppercase tracking-[0.16em] text-[#9a6a46]">{service.durationMinutes} min</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-[24px] border border-[#ead9bd] bg-white/80 p-5">
          <h2 className="font-serif text-2xl text-[#3d2d24]">Recipient and Sender</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <input className="rounded-2xl border border-[#e4cfac] px-4 py-3" placeholder="To" value={form.recipientName} onChange={(e) => { setForm({ ...form, recipientName: e.target.value }); setPurchaseId(""); }} />
            <input className="rounded-2xl border border-[#e4cfac] px-4 py-3" placeholder="Recipient Email" value={form.recipientEmail} onChange={(e) => { setForm({ ...form, recipientEmail: e.target.value }); setPurchaseId(""); }} />
            <input className="rounded-2xl border border-[#e4cfac] px-4 py-3" placeholder="From" value={form.senderName} onChange={(e) => { setForm({ ...form, senderName: e.target.value }); setPurchaseId(""); }} />
            <input className="rounded-2xl border border-[#e4cfac] px-4 py-3" placeholder="Your Email" value={form.senderEmail} onChange={(e) => { setForm({ ...form, senderEmail: e.target.value }); setPurchaseId(""); }} />
          </div>
          <textarea className="mt-4 min-h-[120px] w-full rounded-2xl border border-[#e4cfac] px-4 py-3" placeholder="Add a Personal Message" maxLength={280} value={form.message} onChange={(e) => { setForm({ ...form, message: e.target.value }); setPurchaseId(""); }} />
          <p className="text-right text-sm text-[#725744]">{form.message.length}/280</p>
          <label className="mt-3 flex items-start gap-3 text-sm text-[#4b3528]">
            <input type="checkbox" className="mt-1" checked={form.termsAccepted} onChange={(e) => setForm({ ...form, termsAccepted: e.target.checked })} />
            <span>I agree to the <Link className="underline" href="/gift-cards/terms">Gift Card Terms & Conditions</Link>.</span>
          </label>
        </div>

        <div className="rounded-[24px] border border-[#ead9bd] bg-white/80 p-5">
          <h2 className="font-serif text-2xl text-[#3d2d24]">PayPal Payment</h2>
          <p className="mt-2 text-sm text-[#725744]">PayPal is used only for Gift Card purchases. Normal appointments are paid at the salon.</p>
          {error && <p className="mt-3 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          {processing && <p className="mt-3 flex items-center gap-2 text-sm"><Loader2 className="animate-spin" size={16} /> Processing...</p>}
          {!catalog.paypal.enabled || !catalog.paypal.clientId ? (
            <p className="mt-4 rounded-2xl bg-[#fff7e7] p-4 text-sm text-[#6b4b36]">Online Gift Card payments are currently unavailable. Please contact the salon for assistance.</p>
          ) : (
            <div className={`mt-4 ${formValid ? "" : "pointer-events-none opacity-45"}`} aria-disabled={!formValid}>
              <PayPalScriptProvider options={{ clientId: catalog.paypal.clientId, currency: catalog.settings.currency, intent: "capture" }}>
                <PayPalButtons
                  style={{ layout: "vertical", shape: "pill" }}
                  disabled={!formValid || processing}
                  createOrder={createOrder}
                  onApprove={async (data) => { if (data.orderID) await captureOrder(data.orderID); }}
                  onCancel={() => setError("Payment was cancelled. No Gift Card was issued.")}
                  onError={() => setError("PayPal payment failed. Please try again.")}
                />
              </PayPalScriptProvider>
            </div>
          )}
        </div>
      </div>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="mb-4 flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-[#9a6a46]"><Heart size={16} /> Live Preview</div>
        <GiftCardPreview type={type} to={form.recipientName} from={form.senderName} value={previewValue} message={form.message} />
      </aside>
    </section>
  );
}
