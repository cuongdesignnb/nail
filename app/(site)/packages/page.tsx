import React from "react";
import { Metadata } from "next";
import { fetchPackagesPageContent } from "@/services/packages-page.service";
import { PackagesHero } from "@/components/packages/PackagesHero";
import { PackageTabs } from "@/components/packages/PackageTabs";
import { FeaturedPackages } from "@/components/packages/FeaturedPackages";
import { PackageBenefits } from "@/components/packages/PackageBenefits";
import { PackageComparison } from "@/components/packages/PackageComparison";
import { MembershipRewards } from "@/components/packages/MembershipRewards";
import { OccasionCards } from "@/components/packages/OccasionCards";
import { PackageProcess } from "@/components/packages/PackageProcess";
import { PackageTestimonials } from "@/components/packages/PackageTestimonials";
import { PackageFAQ } from "@/components/packages/PackageFAQ";
import { PackagesCTA } from "@/components/packages/PackagesCTA";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { buildStaticPageMetadata, resolveStaticPageSeo } from "@/lib/seo/seo.service";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildStaticPageMetadata("packages");
  return metadata;
}

export default async function PackagesPage() {
  const [content, seo] = await Promise.all([
    fetchPackagesPageContent(),
    resolveStaticPageSeo("packages"),
  ]);

  return (
    <main className="bg-aera-bg min-h-screen">
      <PageStructuredData
        pathname="/packages"
        title={seo.title}
        faqs={content.faqs?.items?.map((faq) => ({ question: faq.question, answer: faq.answer }))}
      />
      {/* Hero */}
      <PackagesHero data={content.hero} />

      {/* Package Tabs */}
      <PackageTabs categories={content.categories} />

      {/* Package List Grid */}
      <FeaturedPackages packages={content.packages} />

      {/* Benefits */}
      <PackageBenefits data={content.benefits} />

      {/* Comparison table */}
      <PackageComparison data={content.comparison} />

      {/* Membership & Rewards */}
      <MembershipRewards data={content.rewards} />

      {/* Occasions */}
      <OccasionCards data={content.occasions} />

      {/* How it works */}
      <PackageProcess data={content.process} />

      {/* Testimonials */}
      <PackageTestimonials data={content.testimonials} />

      {/* FAQ */}
      <PackageFAQ data={content.faqs} />

      {/* Final CTA */}
      <PackagesCTA data={content.cta} />
    </main>
  );
}
