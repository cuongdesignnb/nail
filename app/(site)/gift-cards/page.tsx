import type { Metadata } from "next";
import { GiftCardPageClient } from "@/components/gift-cards/GiftCardPageClient";
import { getGiftCardCatalog } from "@/lib/gift-cards/gift-card.service";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Gift Cards | Aera Nail Lounge",
  description: "Give the gift of a beautifully curated nail experience at Aera Nail Lounge.",
};

export default async function GiftCardsPage() {
  const catalog = await getGiftCardCatalog();
  return (
    <main className="bg-[#fbf4e8] text-[#3d2d24]">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-[#9a6a46]">Gift Cards</p>
          <h1 className="mt-3 font-serif text-5xl text-[#3d2d24] md:text-7xl">Give the Gift of Luxury</h1>
          <p className="mt-5 text-lg leading-8 text-[#725744]">Treat someone special to a beautifully curated nail experience at Aera Nail Lounge.</p>
        </div>
        <GiftCardPageClient catalog={catalog} />
      </section>
    </main>
  );
}
