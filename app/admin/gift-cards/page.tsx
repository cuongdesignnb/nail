import { GiftCardKpis } from "@/components/admin/gift-cards/GiftCardKpis";
import { GiftCardTable } from "@/components/admin/gift-cards/GiftCardTable";
import { listAdminGiftCards } from "@/lib/gift-cards/gift-card.service";

export const dynamic = "force-dynamic";

export default async function AdminGiftCardsPage({ searchParams }: { searchParams: { search?: string; type?: string; status?: string; emailStatus?: string } }) {
  const data = await listAdminGiftCards(searchParams);
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--admin-muted)]">Commerce</p>
        <h1 className="font-heading text-3xl font-bold text-[var(--admin-ink)]">Gift Cards</h1>
        <p className="mt-2 text-sm text-[var(--admin-muted)]">Search, audit, resend, redeem and adjust Aera Nail Lounge Gift Cards.</p>
      </div>
      <GiftCardKpis kpis={data.kpis} />
      <form className="grid gap-3 rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-4 md:grid-cols-4">
        <input name="search" defaultValue={searchParams.search} className="rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] px-3 py-2" placeholder="Search recipient, purchaser, code suffix" />
        <select name="type" defaultValue={searchParams.type || ""} className="rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] px-3 py-2"><option value="">All types</option><option>AMOUNT</option><option>SERVICE</option></select>
        <select name="status" defaultValue={searchParams.status || ""} className="rounded-[var(--admin-radius-sm)] border border-[var(--admin-border)] px-3 py-2"><option value="">All statuses</option><option>ISSUED</option><option>PARTIALLY_REDEEMED</option><option>REDEEMED</option><option>CANCELLED</option><option>REFUNDED</option></select>
        <button className="rounded-[var(--admin-radius-sm)] bg-[var(--admin-ink)] px-4 py-2 text-white">Filter</button>
      </form>
      <GiftCardTable cards={data.cards} />
    </div>
  );
}
