import Link from "next/link";
import AdminPageHeader from "@/components/admin/ui/AdminPageHeader";
import IssueGiftCardForm from "@/components/admin/gift-cards/IssueGiftCardForm";
import { adminRoutes } from "@/lib/admin/admin-routes";
import { getGiftCardCatalog } from "@/lib/gift-cards/gift-card.service";

export const dynamic = "force-dynamic";

type GiftCardCatalog = Awaited<ReturnType<typeof getGiftCardCatalog>>;

const fallbackCatalog: GiftCardCatalog = {
  settings: {
    currency: "USD",
    amountPresetValues: [25, 50, 75, 100, 150, 200],
    minCustomAmount: 25,
    maxCustomAmount: 500,
    allowCustomAmount: true,
    giftCardsEnabled: true,
  },
  categories: [],
  paypal: { enabled: false, clientId: null, currency: "USD" },
  email: { ready: false },
};

export default async function NewGiftCardPage() {
  let catalog: GiftCardCatalog = fallbackCatalog;
  try {
    catalog = await getGiftCardCatalog();
  } catch {
    catalog = fallbackCatalog;
  }

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        breadcrumbs={[
          { label: "Commerce" },
          { label: "Gift Cards", href: adminRoutes.giftCards },
          { label: "Issue Gift Card" },
        ]}
        title="Issue a Gift Card"
        description="Create and send a digital Gift Card directly to a client."
        actions={
          <>
            <Link
              href={adminRoutes.giftCards}
              className="inline-flex h-10 items-center rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-white px-4 text-sm font-semibold text-[var(--admin-ink)] transition hover:bg-[var(--admin-surface-hover)]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              form="issue-gift-card-form"
              className="inline-flex h-10 items-center rounded-[var(--admin-radius-md)] bg-[var(--admin-accent)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--admin-accent-hover)]"
            >
              Issue Gift Card
            </button>
          </>
        }
      />
      <IssueGiftCardForm catalog={catalog} />
    </div>
  );
}
