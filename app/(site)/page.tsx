import type { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { buildStaticPageMetadata, resolveStaticPageSeo } from "@/lib/seo/seo.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildStaticPageMetadata("home");
  return metadata;
}

export default async function HomePage() {
  const seo = await resolveStaticPageSeo("home");

  return (
    <>
      <PageStructuredData pathname="/" title={seo.title} includeGlobal />
      <HomeClient />
    </>
  );
}
