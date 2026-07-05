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

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchPackagesPageContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
  };
}

export default async function PackagesPage() {
  const content = await fetchPackagesPageContent();

  return (
    <main className="bg-aera-bg min-h-screen">
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
