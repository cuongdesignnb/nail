"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import type { PublicSmtpSettings } from "@/lib/email/mail.types";

export default function SmtpHealthCard({ settings }: { settings: PublicSmtpSettings | null }) {
  const configured = Boolean(settings?.enabled && settings.host && settings.port && settings.fromEmail);
  const verified = Boolean(settings?.verifiedAt);
  return (
    <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-5">
      <h2 className="text-sm font-bold text-[var(--admin-ink)]">Delivery Health</h2>
      <dl className="mt-4 grid gap-3 text-sm">
        <div className="flex justify-between gap-4"><dt className="text-[var(--admin-muted)]">SMTP Status</dt><dd className="font-semibold">{configured ? "Configured" : "Not Configured"}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-[var(--admin-muted)]">Connection Status</dt><dd className={`inline-flex items-center gap-1 font-semibold ${verified ? "text-[var(--admin-success)]" : "text-[var(--admin-danger)]"}`}>{verified ? <CheckCircle2 size={15} /> : <XCircle size={15} />}{verified ? "Verified" : configured ? "Not Verified" : "Failed"}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-[var(--admin-muted)]">Last Verified</dt><dd>{settings?.verifiedAt ? new Date(settings.verifiedAt).toLocaleString() : "Never"}</dd></div>
        <div><dt className="text-[var(--admin-muted)]">Last Error</dt><dd className="mt-1 rounded-lg bg-[var(--admin-surface-muted)] p-2 text-xs">{settings?.lastVerificationError || "None"}</dd></div>
      </dl>
    </section>
  );
}
