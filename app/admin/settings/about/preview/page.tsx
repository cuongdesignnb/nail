import Link from "next/link";
import { AboutHero } from "@/components/about/AboutHero";
import { OurStory } from "@/components/about/OurStory";
import { MissionVisionValues } from "@/components/about/MissionVisionValues";
import { BenefitsSection } from "@/components/about/BenefitsSection";
import { ExpertsSection } from "@/components/about/ExpertsSection";
import { SalonExperience } from "@/components/about/SalonExperience";
import { ProcessSection } from "@/components/about/ProcessSection";
import { AboutTestimonials } from "@/components/about/AboutTestimonials";
import { AboutCTA } from "@/components/about/AboutCTA";
import { PublicSiteShell } from "@/components/public/shell/PublicSiteShell";
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
    <PublicSiteShell mode="draft-preview">
      <div className="preview-toolbar">
        <b>Draft Preview</b>
        <Link href="/admin/settings/about">Back to Editor</Link>
        <Link href="/about">Open Public About Page</Link>
      </div>
      <main className="min-h-screen bg-[#FFFDF8] pb-0 about-preview-page">
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
    </PublicSiteShell>
  );
}
