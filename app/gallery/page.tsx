import React from "react";
import { Metadata } from "next";
import { fetchGalleryPageContent } from "@/services/gallery-page.service";
import { fetchAboutPageContent } from "@/services/about.service";
import { Header } from "@/components/layout/Header";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { FeaturedCollections } from "@/components/gallery/FeaturedCollections";
import { MasonryGallery } from "@/components/gallery/MasonryGallery";
import { GalleryWhyChoose } from "@/components/gallery/GalleryWhyChoose";
import { TrendingInspirations } from "@/components/gallery/TrendingInspirations";
import { GalleryProcess } from "@/components/gallery/GalleryProcess";
import { GalleryTestimonials } from "@/components/gallery/GalleryTestimonials";
import { GalleryCTA } from "@/components/gallery/GalleryCTA";
import { Footer } from "@/components/layout/Footer";

export async function generateMetadata(): Promise<Metadata> {
  const content = await fetchGalleryPageContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
  };
}

export default async function GalleryPage() {
  const aboutContent = await fetchAboutPageContent();
  const content = await fetchGalleryPageContent();

  return (
    <main className="bg-aera-bg min-h-screen">
      <Header data={aboutContent.header} activePath="/gallery" />

      {/* Hero section */}
      <GalleryHero data={content.hero} />

      {/* Filter pills */}
      <GalleryFilters categories={content.categories} />

      {/* Featured Collections */}
      <FeaturedCollections items={content.collections} />

      {/* Masonry designs showcase */}
      <MasonryGallery items={content.items} />

      {/* Why Choose us collage */}
      <GalleryWhyChoose data={content.whyChoose} />

      {/* Horizontal Trending scroll */}
      <TrendingInspirations items={content.trends} />

      {/* How it works workflow */}
      <GalleryProcess items={content.processSteps} />

      {/* Client reviews */}
      <GalleryTestimonials items={content.testimonials} />

      {/* CTA final button */}
      <GalleryCTA data={content.cta} />

      <Footer
        data={aboutContent.footer}
        logo={aboutContent.header.logo}
        brandName={aboutContent.header.brandName}
      />
    </main>
  );
}
