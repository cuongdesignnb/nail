"use client";

type GiftCardIssueSummaryProps = {
  type: "AMOUNT" | "SERVICE";
  valueLabel: string;
  recipientEmail: string;
  sendEmail: boolean;
};

export default function GiftCardIssueSummary({ type, valueLabel, recipientEmail, sendEmail }: GiftCardIssueSummaryProps) {
  return (
    <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-4">
      <h3 className="text-sm font-bold text-[var(--admin-ink)]">Issue Summary</h3>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[var(--admin-muted)]">Type</dt>
          <dd className="font-semibold text-[var(--admin-ink)]">{type === "SERVICE" ? "Service Gift Card" : "Amount Gift Card"}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[var(--admin-muted)]">Value</dt>
          <dd className="text-right font-semibold text-[var(--admin-ink)]">{valueLabel}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-[var(--admin-muted)]">Delivery</dt>
          <dd className="text-right font-semibold text-[var(--admin-ink)]">{sendEmail ? `Email ${recipientEmail || "recipient"}` : "Create without sending"}</dd>
        </div>
      </dl>
    </div>
  );
}
