import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { PageShell } from "@/components/shared/PageShell";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { buildStaticPageMetadata, resolveStaticPageSeo } from "@/lib/seo/seo.service";
import { getPublishedPromotionsPageContent } from "@/lib/content/content.service";
import { listActivePromotionCampaigns } from "@/lib/promotions/promotion.service";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildStaticPageMetadata("promotions");
  return metadata;
}

export default async function PromotionsPage() {
  const [seo, content, campaigns] = await Promise.all([
    resolveStaticPageSeo("promotions"),
    getPublishedPromotionsPageContent(),
    listActivePromotionCampaigns(),
  ]);
  const heroImage = normalizeMediaUrl(content.hero.image.src);
  const featuredIds = new Set(content.featuredPromotions.featuredPromotionIds);
  const visibleCampaigns = content.featuredPromotions.showAll || !featuredIds.size
    ? campaigns
    : campaigns.filter((campaign) => featuredIds.has(campaign.id));

  return (
    <PageShell eyebrow={content.hero.eyebrow} title={`${content.hero.title} ${content.hero.highlight}`.trim()} copy={content.hero.description}>
      <PageStructuredData pathname="/promotions" title={seo.title} />
      {heroImage && (
        <section className="relative mx-auto mb-8 aspect-[16/7] w-full max-w-6xl overflow-hidden rounded-[2rem]">
          <Image src={heroImage} alt={content.hero.image.alt} fill priority sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover" />
        </section>
      )}
      <section className="content-grid two">
        {visibleCampaigns.map((campaign) => {
          const image = normalizeMediaUrl(campaign.imageUrl);
          return (
            <article className="lux-card offer-card overflow-hidden" key={campaign.id}>
              {image && <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-2xl"><Image src={image} alt={campaign.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" /></div>}
              {campaign.badge && <span>{campaign.badge}</span>}
              <h3>{campaign.title}</h3>
              <p>{campaign.description || campaign.subtitle}</p>
              <Link className="primary-btn" href={`/booking?promotion=${campaign.id}`}>{campaign.ctaLabel || "View Offer"}</Link>
            </article>
          );
        })}
      </section>
    </PageShell>
  );
}
