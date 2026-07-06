"use client";

import { useState } from "react";

export function GiftCardBalanceForm() {
  const [code, setCode] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setResult(null);
    const res = await fetch("/api/gift-cards/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, recipientEmail }),
    });
    const json = await res.json();
    if (!json.success) setError(json.error || "Unable to check balance.");
    else setResult(json.data);
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-xl rounded-[28px] border border-[#ead9bd] bg-white p-6 shadow-sm">
      <label className="block text-sm font-medium">Gift Card Code<input className="mt-2 w-full rounded-2xl border border-[#e4cfac] px-4 py-3" value={code} onChange={(e) => setCode(e.target.value)} placeholder="AERA-7Q5K-M9X2-P4RD" /></label>
      <label className="mt-4 block text-sm font-medium">Recipient Email<input className="mt-2 w-full rounded-2xl border border-[#e4cfac] px-4 py-3" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} placeholder="recipient@example.com" /></label>
      <button className="mt-5 rounded-full bg-[#7b4e34] px-5 py-3 text-sm font-semibold text-white">Check Balance</button>
      {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {result && (
        <div className="mt-4 rounded-2xl bg-[#fff7e7] p-4 text-sm">
          <p><b>Status:</b> {result.status}</p>
          <p><b>Code:</b> {result.code}</p>
          {result.type === "SERVICE" ? <p><b>Service:</b> {result.serviceName}</p> : <p><b>Remaining:</b> {new Intl.NumberFormat("en-US", { style: "currency", currency: result.currency }).format(result.remainingBalance)}</p>}
        </div>
      )}
    </form>
  );
}
