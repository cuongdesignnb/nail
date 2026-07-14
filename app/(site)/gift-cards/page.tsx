import type { Metadata } from "next";
import { GiftCardPageClient } from "@/components/gift-cards/GiftCardPageClient";
import { getGiftCardCatalog } from "@/lib/gift-cards/gift-card.service";
import type { GiftCardCatalog } from "@/lib/gift-cards/gift-card.types";
import { getPublicSiteSettings } from "@/lib/settings/public-settings.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSiteSettings();
  return { title: `Gift Cards | ${settings.brand.name}`, description: `Give the gift of a beautifully curated nail experience at ${settings.brand.name}.` };
}

export default async function GiftCardsPage() {
  const [catalog, publicSettings]: [GiftCardCatalog, Awaited<ReturnType<typeof getPublicSiteSettings>>] = await Promise.all([getGiftCardCatalog().catch(() => ({
    settings: {
      currency: "USD",
      amountPresetValues: [25, 50, 75, 100, 125, 150, 200, 250],
      minCustomAmount: 25,
      maxCustomAmount: 500,
      allowCustomAmount: true,
      giftCardsEnabled: true,
    },
    categories: [],
    paypal: { enabled: false, clientId: null, currency: "USD" },
    email: { ready: false, configured: false, verified: false },
  })), getPublicSiteSettings()]);
  return (
    <main className="bg-[#fbf4e8] text-[#3d2d24]">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-[#9a6a46]">Gift Cards</p>
          <h1 className="mt-3 font-serif text-5xl text-[#3d2d24] md:text-7xl">Give the Gift of Luxury</h1>
          <p className="mt-5 text-lg leading-8 text-[#725744]">Treat someone special to a beautifully curated nail experience at {publicSettings.brand.name}.</p>
        </div>
        <GiftCardPageClient catalog={catalog} />
      </section>
    </main>
  );
}
