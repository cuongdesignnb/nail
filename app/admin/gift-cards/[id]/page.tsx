import Link from "next/link";
import { notFound } from "next/navigation";
import { GiftCardActionDialog } from "@/components/admin/gift-cards/GiftCardActionDialog";
import { GiftCardStatusBadge } from "@/components/admin/gift-cards/GiftCardStatusBadge";
import { getAdminGiftCard } from "@/lib/gift-cards/gift-card.service";

function money(value: unknown, currency = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(Number(value || 0));
}

export default async function AdminGiftCardDetailPage({ params }: { params: { id: string } }) {
  const card = await getAdminGiftCard(params.id);
  if (!card) notFound();
  return (
    <div className="space-y-6">
      <div>
        <Link className="text-sm font-semibold text-aera-accent" href="/admin/gift-cards">Back to Gift Cards</Link>
        <h1 className="mt-2 font-heading text-3xl font-bold">Gift Card {card.codeSuffix}</h1>
        <div className="mt-3 flex flex-wrap gap-2"><GiftCardStatusBadge value={card.status} /><GiftCardStatusBadge value={card.emailStatus} /></div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          <div className="rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
            <h2 className="font-heading text-lg font-bold">Details</h2>
            <dl className="mt-4 grid gap-3 md:grid-cols-2">
              <div><dt className="text-xs text-[var(--admin-muted)]">Recipient</dt><dd>{card.recipientName} ({card.recipientEmail})</dd></div>
              <div><dt className="text-xs text-[var(--admin-muted)]">Sender</dt><dd>{card.senderName} ({card.senderEmail})</dd></div>
              <div><dt className="text-xs text-[var(--admin-muted)]">Order</dt><dd>{card.purchase.orderNumber}</dd></div>
              <div><dt className="text-xs text-[var(--admin-muted)]">PayPal</dt><dd>{card.purchase.paypalOrderId || "Not available"}</dd></div>
              <div><dt className="text-xs text-[var(--admin-muted)]">Value</dt><dd>{card.type === "SERVICE" ? card.serviceNameSnapshot : money(card.initialAmount, card.currency)}</dd></div>
              <div><dt className="text-xs text-[var(--admin-muted)]">Remaining</dt><dd>{money(card.remainingBalance, card.currency)}</dd></div>
            </dl>
          </div>
          <div className="rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4">
            <h2 className="font-heading text-lg font-bold">Transaction Timeline</h2>
            <div className="mt-4 space-y-3">
              {card.transactions.map((tx) => (
                <div key={tx.id} className="rounded border border-[var(--admin-border)] p-3 text-sm">
                  <b>{tx.type}</b> {money(tx.amount, card.currency)}
                  <p className="text-[var(--admin-muted)]">{tx.note || "No note"} - {tx.createdAt.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <GiftCardActionDialog id={card.id} type={card.type} />
      </div>
    </div>
  );
}
