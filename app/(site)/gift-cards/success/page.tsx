import Link from "next/link";
import { getPublicSiteSettings } from "@/lib/settings/public-settings.service";

export const dynamic = "force-dynamic";

export default async function GiftCardSuccessPage({ searchParams }: { searchParams: { order?: string } }) {
  const settings = await getPublicSiteSettings();
  return (
    <main className="bg-[#fbf4e8] px-4 py-20 text-[#3d2d24]">
      <section className="mx-auto max-w-2xl rounded-[28px] border border-[#ead9bd] bg-white p-8 text-center shadow-sm">
        <p className="text-xs uppercase tracking-[0.28em] text-[#9a6a46]">Gift Card Sent</p>
        <h1 className="mt-3 font-serif text-4xl">Thank You</h1>
        <p className="mt-4 text-[#725744]">Your PayPal payment was verified and your {settings.brand.name} Gift Card has been issued.</p>
        {searchParams.order && <p className="mt-4 rounded-2xl bg-[#fff7e7] p-3 text-sm">Order {searchParams.order}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link className="rounded-full bg-[#7b4e34] px-5 py-3 text-sm font-semibold text-white" href="/gift-cards">Buy Another Gift Card</Link>
          <Link className="rounded-full border border-[#caa46b] px-5 py-3 text-sm font-semibold" href="/">Back to Home</Link>
        </div>
      </section>
    </main>
  );
}
