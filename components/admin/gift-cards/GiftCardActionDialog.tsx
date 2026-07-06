"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function GiftCardActionDialog({ id, type }: { id: string; type: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  async function run(path: string, body: Record<string, unknown> = {}) {
    setError("");
    const res = await fetch(`/api/admin/gift-cards/${id}/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!json.success) setError(json.error || "Action failed.");
    else router.refresh();
  }

  return (
    <div className="space-y-3 rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
      <h2 className="font-heading text-lg font-bold">Admin Actions</h2>
      {type === "AMOUNT" && <input className="w-full rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] px-3 py-2" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />}
      <textarea className="w-full rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] px-3 py-2" placeholder="Internal note" value={note} onChange={(e) => setNote(e.target.value)} />
      {error && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <button className="rounded bg-[var(--admin-ink)] px-3 py-2 text-sm text-white" onClick={() => run("redeem", { amount: type === "AMOUNT" ? Number(amount) : undefined, note })}>Redeem</button>
        {type === "AMOUNT" && <button className="rounded border border-[var(--admin-border)] px-3 py-2 text-sm" onClick={() => run("adjust-balance", { amount: Number(amount), note })}>Adjust Balance</button>}
        <button className="rounded border border-[var(--admin-border)] px-3 py-2 text-sm" onClick={() => run("resend")}>Resend Email</button>
        <button className="rounded border border-red-200 px-3 py-2 text-sm text-red-700" onClick={() => run("void", { note })}>Void</button>
      </div>
    </div>
  );
}
