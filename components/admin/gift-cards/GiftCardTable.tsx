import Link from "next/link";
import { GiftCardStatusBadge } from "./GiftCardStatusBadge";

export type AdminGiftCardRow = {
  id: string;
  code: string;
  type: string;
  recipient: string;
  purchaser: string;
  value: string;
  remainingBalance: string;
  status: string;
  emailStatus: string;
  createdAt: string;
  orderNumber: string;
};

export function GiftCardTable({ cards }: { cards: AdminGiftCardRow[] }) {
  return (
    <div className="overflow-x-auto rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)]">
      <table className="min-w-full text-sm">
        <thead className="bg-[var(--admin-surface-muted)] text-left text-xs uppercase tracking-wider text-[var(--admin-muted)]">
          <tr>
            {["Code", "Type", "Recipient", "Purchaser", "Value", "Remaining", "Status", "Email", "Created", "Actions"].map((heading) => <th key={heading} className="px-4 py-3">{heading}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--admin-border)]">
          {cards.map((card) => (
            <tr key={card.id}>
              <td className="px-4 py-3 font-mono">{card.code}</td>
              <td className="px-4 py-3">{card.type}</td>
              <td className="px-4 py-3">{card.recipient}</td>
              <td className="px-4 py-3">{card.purchaser}</td>
              <td className="px-4 py-3">{card.value}</td>
              <td className="px-4 py-3">{card.remainingBalance}</td>
              <td className="px-4 py-3"><GiftCardStatusBadge value={card.status} /></td>
              <td className="px-4 py-3"><GiftCardStatusBadge value={card.emailStatus} /></td>
              <td className="px-4 py-3">{new Date(card.createdAt).toLocaleDateString()}</td>
              <td className="px-4 py-3"><Link className="font-semibold text-[var(--admin-accent)]" href={`/admin/gift-cards/${card.id}`}>View Details</Link></td>
            </tr>
          ))}
          {cards.length === 0 && <tr><td className="px-4 py-8 text-center text-[var(--admin-muted)]" colSpan={10}>No Gift Cards found.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
