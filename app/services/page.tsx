import { Metadata } from "next";
import { fetchAboutPageContent } from "@/services/about.service";
import { fetchServicesPageContent } from "@/services/services-page.service";
import { Header } from "@/components/layout/Header";
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
import { Footer } from "@/components/layout/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchServicesPageContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
  };
}

export default async function ServicesPage() {
  const aboutContent = await fetchAboutPageContent();
  const servicesContent = await fetchServicesPageContent();

  return (
    <main className="min-h-screen bg-aera-bg pb-0">
      <Header data={aboutContent.header} activePath="/services" />
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
      <Footer
        data={aboutContent.footer}
        logo={aboutContent.header.logo}
        brandName={aboutContent.header.brandName}
      />
    </main>
  );
}
