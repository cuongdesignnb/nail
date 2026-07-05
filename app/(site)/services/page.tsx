import { Metadata } from "next";
import { fetchServicesPageContent } from "@/services/services-page.service";
import { ServicesHero } from "@/components/services/ServicesHero";
import { QuickServiceCategories } from "@/components/services/QuickServiceCategories";
import { SignatureServices } from "@/components/services/SignatureServices";
import { WhyChooseServices } from "@/components/services/WhyChooseServices";
import { ServicePricingMatrix } from "@/components/services/ServicePricingMatrix";
import { AppointmentProcess } from "@/components/services/AppointmentProcess";
import { DesignInspiration } from "@/components/services/DesignInspiration";
import { ServicePackages } from "@/components/services/ServicePackages";
import { ServicesFAQ } from "@/components/services/ServicesFAQ";
import { ServicesCTA } from "@/components/services/ServicesCTA";

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchServicesPageContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
  };
}

export default async function ServicesPage() {
  const servicesContent = await fetchServicesPageContent();

  return (
    <main className="min-h-screen bg-aera-bg pb-0">
      <ServicesHero data={servicesContent.hero} />
      <QuickServiceCategories items={servicesContent.categories} />
      <SignatureServices items={servicesContent.signatureServices} />
      <WhyChooseServices data={servicesContent.whyChoose} />
      <ServicePricingMatrix data={servicesContent.pricing} />
      <AppointmentProcess items={servicesContent.process} />
      <DesignInspiration items={servicesContent.gallery} />
      <ServicePackages items={servicesContent.packages} />
      <ServicesFAQ items={servicesContent.faqs} />
      <ServicesCTA data={servicesContent.cta} />
    </main>
  );
}
