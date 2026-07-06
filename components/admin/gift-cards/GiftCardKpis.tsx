import { BadgeDollarSign, Gift, MailWarning, RotateCcw } from "lucide-react";

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value || 0);
}

export function GiftCardKpis({ kpis }: { kpis: { salesToday: number; activeBalance: number; redeemedThisMonth: number; pendingEmail: number } }) {
  const cards = [
    { icon: BadgeDollarSign, label: "Gift Card Sales Today", value: money(kpis.salesToday) },
    { icon: Gift, label: "Active Gift Card Balance", value: money(kpis.activeBalance) },
    { icon: RotateCcw, label: "Redeemed This Month", value: money(kpis.redeemedThisMonth) },
    { icon: MailWarning, label: "Pending Email Delivery", value: String(kpis.pendingEmail) },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-5 shadow-[var(--admin-shadow-sm)]">
          <div className="flex h-10 w-10 items-center justify-center rounded-[var(--admin-radius-md)] bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">
            <card.icon size={20} />
          </div>
          <p className="mt-4 font-heading text-2xl font-bold text-[var(--admin-ink)]">{card.value}</p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-[var(--admin-muted)]">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
