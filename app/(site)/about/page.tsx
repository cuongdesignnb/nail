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

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchAboutPageContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
  };
}

export default async function AboutPage() {
  const content = await fetchAboutPageContent();

  return (
    <main className="min-h-screen bg-aera-bg pb-0">
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
