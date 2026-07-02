import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStory } from "@/components/about/OurStory";
import { MissionVisionValues } from "@/components/about/MissionVisionValues";
import { BenefitsSection } from "@/components/about/BenefitsSection";
import { ExpertsSection } from "@/components/about/ExpertsSection";
import { SalonExperience } from "@/components/about/SalonExperience";
import { ProcessSection } from "@/components/about/ProcessSection";
import { AboutTestimonials } from "@/components/about/AboutTestimonials";
import { AboutCTA } from "@/components/about/AboutCTA";
import { Footer } from "@/components/layout/Footer";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getDraftAboutPageContent } from "@/lib/services/about-content.service";

export const dynamic = "force-dynamic";

export default async function AboutPreviewPage() {
  try {
    requireAdmin();
  } catch {
    return (
      <div className="preview-login">
        <h1>Draft Preview</h1>
        <p>Please sign in as an Owner or Manager to preview draft content.</p>
        <Link className="primary-btn" href="/login">Sign In</Link>
      </div>
    );
  }

  const content = await getDraftAboutPageContent();

  return (
    <main className="min-h-screen bg-aera-bg pb-0 about-preview-page">
      <div className="preview-toolbar">
        <b>Draft Preview</b>
        <Link href="/admin/settings/about">Back to Editor</Link>
        <Link href="/about">Open Public About Page</Link>
      </div>
      <Header data={content.header} activePath="/about" />
      <AboutHero data={content.hero} />
      <OurStory data={content.story} />
      <MissionVisionValues items={content.missionVisionValues} />
      <BenefitsSection data={content.benefits} />
      <ExpertsSection data={content.experts} />
      <SalonExperience data={content.salonExperience} />
      <ProcessSection data={content.process} />
      <AboutTestimonials data={content.testimonials} />
      <AboutCTA data={content.cta} />
      <Footer data={content.footer} logo={content.header.logo} brandName={content.header.brandName} />
    </main>
  );
}
