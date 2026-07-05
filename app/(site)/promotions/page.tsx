import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { promotions } from "@/lib/data";
import { buildStaticPageMetadata, resolveStaticPageSeo } from "@/lib/seo/seo.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildStaticPageMetadata("promotions");
  return metadata;
}

export default async function PromotionsPage() {
  const seo = await resolveStaticPageSeo("promotions");

  return (
    <PageShell eyebrow="Promotions" title="Current Offers" copy="Active promotions and first-visit rewards for eligible bookings.">
      <PageStructuredData pathname="/promotions" title={seo.title} />
      <section className="content-grid two">
        {promotions.filter((promo) => promo.active).map((promo) => (
          <article className="lux-card offer-card" key={promo.id}>
            <span>{promo.code}</span>
            <h3>{promo.title}</h3>
            <p>Valid until {promo.validUntil}. {promo.firstBookingOnly ? "First booking only." : "Available for eligible guests."}</p>
            <Link className="primary-btn" href={`/booking?promo=${promo.code}`}>Use Offer</Link>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
