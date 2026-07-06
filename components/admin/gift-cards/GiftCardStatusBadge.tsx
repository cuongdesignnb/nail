export function GiftCardStatusBadge({ value }: { value: string }) {
  const toneMap: Record<string, string> = {
    ISSUED: "bg-[var(--admin-success-soft)] text-[var(--admin-success)]",
    SENT: "bg-[var(--admin-success-soft)] text-[var(--admin-success)]",
    PAID: "bg-[var(--admin-success-soft)] text-[var(--admin-success)]",
    PARTIALLY_REDEEMED: "bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]",
    REDEEMED: "bg-[var(--admin-neutral-soft)] text-[var(--admin-neutral)]",
    CANCELLED: "bg-[var(--admin-danger-soft)] text-[var(--admin-danger)]",
    REFUNDED: "bg-[var(--admin-danger-soft)] text-[var(--admin-danger)]",
    EXPIRED: "bg-[var(--admin-surface-muted)] text-[var(--admin-muted)]",
    PENDING: "bg-[var(--admin-warning-soft)] text-[var(--admin-warning)]",
    FAILED: "bg-[var(--admin-danger-soft)] text-[var(--admin-danger)]",
  };
  const tone = toneMap[value] ?? "bg-[var(--admin-surface-muted)] text-[var(--admin-muted)]";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${tone}`}>
      {value.replace(/_/g, " ")}
    </span>
  );
}
