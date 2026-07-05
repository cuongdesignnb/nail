import { Metadata } from "next";
import { fetchAboutPageContent } from "@/services/about.service";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStory } from "@/components/about/OurStory";
import { MissionVisionValues } from "@/components/about/MissionVisionValues";
import { BenefitsSection } from "@/components/about/BenefitsSection";
import { ExpertsSection } from "@/components/about/ExpertsSection";
import { SalonExperience } from "@/components/about/SalonExperience";
import { ProcessSection } from "@/components/about/ProcessSection";
import { AboutTestimonials } from "@/components/about/AboutTestimonials";
import { AboutCTA } from "@/components/about/AboutCTA";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { buildStaticPageMetadata, resolveStaticPageSeo } from "@/lib/seo/seo.service";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildStaticPageMetadata("about");
  return metadata;
}

export default async function AboutPage() {
  const [content, seo] = await Promise.all([
    fetchAboutPageContent(),
    resolveStaticPageSeo("about"),
  ]);

  return (
    <main className="min-h-screen bg-aera-bg pb-0">
      <PageStructuredData pathname="/about" title={seo.title} includeGlobal />
      <AboutHero data={content.hero} />
      <OurStory data={content.story} />
      <MissionVisionValues items={content.missionVisionValues} />
      <BenefitsSection data={content.benefits} />
      <ExpertsSection data={content.experts} />
      <SalonExperience data={content.salonExperience} />
      <ProcessSection data={content.process} />
      <AboutTestimonials data={content.testimonials} />
      <AboutCTA data={content.cta} />
    </main>
  );
}
