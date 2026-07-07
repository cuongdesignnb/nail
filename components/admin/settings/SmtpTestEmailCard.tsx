"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function SmtpTestEmailCard({ disabled, onSent }: { disabled: boolean; onSent: (message: string, type?: "success" | "error") => void }) {
  const [to, setTo] = useState("");
  const [sending, setSending] = useState(false);
  async function send() {
    setSending(true);
    const response = await fetch("/api/admin/settings/email/send-test", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to }),
    });
    const json = await response.json();
    setSending(false);
    onSent(json.message || json.error || "Test email complete.", response.ok ? "success" : "error");
  }
  return (
    <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
      <h2 className="text-sm font-bold text-[var(--admin-ink)]">Test Email</h2>
      <label className="mt-4 block text-sm font-semibold text-[var(--admin-ink)]">
        Send Test Email To
        <input className="mt-1.5 h-10 w-full rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] px-3 text-sm" type="email" value={to} onChange={(event) => setTo(event.target.value)} placeholder="owner@example.com" />
      </label>
      <button type="button" disabled={disabled || sending || !to.includes("@")} onClick={send} className="mt-4 inline-flex h-10 items-center gap-2 rounded-[var(--admin-radius-md)] bg-[var(--admin-accent)] px-4 text-sm font-semibold text-white disabled:opacity-50">
        <Send size={15} /> {sending ? "Sending..." : "Send Test Email"}
      </button>
      {disabled && <p className="mt-2 text-xs text-[var(--admin-muted)]">SMTP is not configured.</p>}
    </section>
  );
}
