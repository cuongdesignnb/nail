import React from "react";
import { Metadata } from "next";
import { fetchGalleryPageContent } from "@/services/gallery-page.service";
import { GalleryHero } from "@/components/gallery/GalleryHero";
import { GalleryFilters } from "@/components/gallery/GalleryFilters";
import { FeaturedCollections } from "@/components/gallery/FeaturedCollections";
import { MasonryGallery } from "@/components/gallery/MasonryGallery";
import { GalleryWhyChoose } from "@/components/gallery/GalleryWhyChoose";
import { TrendingInspirations } from "@/components/gallery/TrendingInspirations";
import { GalleryProcess } from "@/components/gallery/GalleryProcess";
import { GalleryTestimonials } from "@/components/gallery/GalleryTestimonials";
import { GalleryCTA } from "@/components/gallery/GalleryCTA";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { buildStaticPageMetadata, resolveStaticPageSeo } from "@/lib/seo/seo.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildStaticPageMetadata("gallery");
  return metadata;
}

export default async function GalleryPage() {
  const [content, seo] = await Promise.all([
    fetchGalleryPageContent(),
    resolveStaticPageSeo("gallery"),
  ]);

  return (
    <main className="bg-aera-bg min-h-screen">
      <PageStructuredData pathname="/gallery" title={seo.title} />
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
    </main>
  );
}
