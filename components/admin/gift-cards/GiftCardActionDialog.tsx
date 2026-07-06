"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, DollarSign, Mail, XCircle } from "lucide-react";

export function GiftCardActionDialog({ id, type }: { id: string; type: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function run(path: string, body: Record<string, unknown> = {}) {
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/gift-cards/${id}/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) setError(json.error || "Action failed.");
      else router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow-sm)]">
      <h2 className="font-heading text-lg font-bold text-[var(--admin-ink)]">Admin Actions</h2>
      
      {type === "AMOUNT" && (
        <input
          className="w-full rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2.5 text-sm text-[var(--admin-ink)] placeholder:text-[var(--admin-placeholder)] transition-colors focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      )}
      
      <textarea
        className="w-full rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 py-2.5 text-sm text-[var(--admin-ink)] placeholder:text-[var(--admin-placeholder)] transition-colors focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20"
        placeholder="Internal note"
        rows={2}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      
      {error && (
        <p className="rounded-[var(--admin-radius-sm)] bg-[var(--admin-danger-soft)] p-3 text-sm font-medium text-[var(--admin-danger)]">
          {error}
        </p>
      )}
      
      <div className="flex flex-wrap gap-2">
        <button
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-[var(--admin-radius-sm)] bg-[var(--admin-ink)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--admin-ink)]/90 disabled:opacity-50"
          onClick={() => run("redeem", { amount: type === "AMOUNT" ? Number(amount) : undefined, note })}
        >
          <CreditCard size={14} />
          Redeem
        </button>
        {type === "AMOUNT" && (
          <button
            disabled={loading}
            className="inline-flex items-center gap-1.5 rounded-[var(--admin-radius-sm)] border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-surface-hover)] disabled:opacity-50"
            onClick={() => run("adjust-balance", { amount: Number(amount), note })}
          >
            <DollarSign size={14} />
            Adjust Balance
          </button>
        )}
        <button
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-[var(--admin-radius-sm)] border border-[var(--admin-border-strong)] bg-[var(--admin-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-surface-hover)] disabled:opacity-50"
          onClick={() => run("resend")}
        >
          <Mail size={14} />
          Resend Email
        </button>
        <button
          disabled={loading}
          className="inline-flex items-center gap-1.5 rounded-[var(--admin-radius-sm)] border border-[var(--admin-danger-soft)] bg-[var(--admin-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--admin-danger)] transition-colors hover:bg-[var(--admin-danger-soft)] disabled:opacity-50"
          onClick={() => run("void", { note })}
        >
          <XCircle size={14} />
          Void
        </button>
      </div>
    </div>
  );
}
