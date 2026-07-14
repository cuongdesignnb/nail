import type { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { buildStaticPageMetadata, resolveStaticPageSeo } from "@/lib/seo/seo.service";
import { getPublicSiteSettings } from "@/lib/settings/public-settings.service";
import { getPublicHomeData } from "@/lib/home/home-data.service";
import { getActivePopupCampaign, listActiveHomepageCampaigns } from "@/lib/promotions/promotion.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildStaticPageMetadata("home");
  return metadata;
}

export default async function HomePage() {
  const [seo, settings, homeData, campaigns, popupCampaign] = await Promise.all([
    resolveStaticPageSeo("home"),
    getPublicSiteSettings(),
    getPublicHomeData(),
    listActiveHomepageCampaigns(),
    getActivePopupCampaign(),
  ]);

  return (
    <>
      <PageStructuredData pathname="/" title={seo.title} includeGlobal />
      <HomeClient
        settings={settings}
        homeData={homeData}
        campaigns={campaigns}
        popupCampaign={popupCampaign}
      />
    </>
  );
}
