'use client';

import React from "react";
import type { ContentPageKey } from "@/lib/content/content.types";

import {
  SeoSectionEditor,
  HeroSectionEditor,
  CtaSectionEditor,
  TestimonialsSectionEditor,
  FaqSectionEditor,
  ProcessStepsSectionEditor,
  HomeSignatureServicesSectionEditor,
  HomeAboutPreviewSectionEditor,
  HomeFeaturedGallerySectionEditor,
  HomePackagesPreviewSectionEditor,
  HomePromotionBannerSectionEditor,
  HomeTeamPreviewSectionEditor,
  HomeInstagramPreviewSectionEditor,
  GlobalBrandSectionEditor,
  GlobalHeaderNavSectionEditor,
  GlobalFooterSectionEditor,
  GlobalSocialLinksSectionEditor,
  GlobalDefaultContactSectionEditor,
  PromotionIntroSectionEditor,
  FeaturedPromotionsSectionEditor,
  TermsAndConditionsSectionEditor,
  HowToRedeemSectionEditor,
  ContactInfoSectionEditor,
  OpeningHoursSectionEditor,
  MapLocationSectionEditor,
  ContactFormIntroSectionEditor,
  SocialLinksSectionEditor,
  BlogLatestStoriesSectionEditor,
  BlogCategoryNavSectionEditor,
  BlogEditorsPicksSectionEditor,
  BlogTrendingStoriesSectionEditor,
  BlogNewsletterSectionEditor,
} from "./sections";

// Additional specific section editors to be imported
import { AboutStorySectionEditor } from "./sections/AboutStorySectionEditor";
import { AboutMissionVisionValuesSectionEditor } from "./sections/AboutMissionVisionValuesSectionEditor";
import { AboutBenefitsSectionEditor } from "./sections/AboutBenefitsSectionEditor";
import { AboutExpertsSectionEditor } from "./sections/AboutExpertsSectionEditor";
import { AboutSalonExperienceSectionEditor } from "./sections/AboutSalonExperienceSectionEditor";
import { ServicesQuickCategoriesSectionEditor } from "./sections/ServicesQuickCategoriesSectionEditor";
import { ServicesWhyChooseSectionEditor } from "./sections/ServicesWhyChooseSectionEditor";
import { ServicesPricingMatrixSectionEditor } from "./sections/ServicesPricingMatrixSectionEditor";
import { ServicesDesignInspirationSectionEditor } from "./sections/ServicesDesignInspirationSectionEditor";
import { ServicesFeaturedPackagesSectionEditor } from "./sections/ServicesFeaturedPackagesSectionEditor";
import { GalleryFilterLabelsSectionEditor } from "./sections/GalleryFilterLabelsSectionEditor";
import { GalleryFeaturedCollectionsSectionEditor } from "./sections/GalleryFeaturedCollectionsSectionEditor";
import { PackagesBenefitsSectionEditor } from "./sections/PackagesBenefitsSectionEditor";
import { PackagesComparisonSectionEditor } from "./sections/PackagesComparisonSectionEditor";
import { PackagesRewardsSectionEditor } from "./sections/PackagesRewardsSectionEditor";
import { PackagesOccasionsSectionEditor } from "./sections/PackagesOccasionsSectionEditor";
import { GlobalDefaultShareImageSectionEditor } from "./sections/GlobalDefaultShareImageSectionEditor";

const editorMap: Record<string, React.ComponentType<any>> = {
  // Shared
  "*:seo": SeoSectionEditor,
  "*:hero": HeroSectionEditor,
  "*:cta": CtaSectionEditor,
  "*:finalCta": CtaSectionEditor,
  "*:testimonials": TestimonialsSectionEditor,
  "*:faq": FaqSectionEditor,
  "*:faqs": FaqSectionEditor,
  "*:process": ProcessStepsSectionEditor,
  "*:bookingSteps": ProcessStepsSectionEditor,
  "*:processSteps": ProcessStepsSectionEditor,

  // Home page specific
  "home:signatureServices": HomeSignatureServicesSectionEditor,
  "home:aboutPreview": HomeAboutPreviewSectionEditor,
  "home:featuredGallery": HomeFeaturedGallerySectionEditor,
  "home:packagesPreview": HomePackagesPreviewSectionEditor,
  "home:promotionBanner": HomePromotionBannerSectionEditor,
  "home:teamPreview": HomeTeamPreviewSectionEditor,
  "home:instagramPreview": HomeInstagramPreviewSectionEditor,

  // Global specific
  "global:brand": GlobalBrandSectionEditor,
  "global:headerNav": GlobalHeaderNavSectionEditor,
  "global:footer": GlobalFooterSectionEditor,
  "global:socialLinks": GlobalSocialLinksSectionEditor,
  "global:defaultContact": GlobalDefaultContactSectionEditor,
  "global:defaultShareImage": GlobalDefaultShareImageSectionEditor,

  // About specific
  "about:story": AboutStorySectionEditor,
  "about:missionVisionValues": AboutMissionVisionValuesSectionEditor,
  "about:benefits": AboutBenefitsSectionEditor,
  "about:experts": AboutExpertsSectionEditor,
  "about:salonExperience": AboutSalonExperienceSectionEditor,

  // Services specific
  "services:categories": ServicesQuickCategoriesSectionEditor,
  "services:signatureServices": HomeSignatureServicesSectionEditor,
  "services:whyChoose": ServicesWhyChooseSectionEditor,
  "services:pricing": ServicesPricingMatrixSectionEditor,
  "services:gallery": ServicesDesignInspirationSectionEditor,
  "services:packages": ServicesFeaturedPackagesSectionEditor,

  // Gallery specific
  "gallery:categories": GalleryFilterLabelsSectionEditor,
  "gallery:collections": GalleryFeaturedCollectionsSectionEditor,
  "gallery:whyChoose": ServicesWhyChooseSectionEditor,
  "gallery:trends": GalleryFeaturedCollectionsSectionEditor,
  "gallery:processSteps": ProcessStepsSectionEditor,

  // Packages specific
  "packages:benefits": PackagesBenefitsSectionEditor,
  "packages:comparison": PackagesComparisonSectionEditor,
  "packages:rewards": PackagesRewardsSectionEditor,
  "packages:occasions": PackagesOccasionsSectionEditor,

  // Promotions specific
  "promotions:promotionIntro": PromotionIntroSectionEditor,
  "promotions:featuredPromotions": FeaturedPromotionsSectionEditor,
  "promotions:termsAndConditions": TermsAndConditionsSectionEditor,
  "promotions:howToRedeem": HowToRedeemSectionEditor,

  // Contact specific
  "contact:contactInfo": ContactInfoSectionEditor,
  "contact:openingHours": OpeningHoursSectionEditor,
  "contact:mapLocation": MapLocationSectionEditor,
  "contact:contactForm": ContactFormIntroSectionEditor,
  "contact:socialLinks": SocialLinksSectionEditor,

  // Blog specific
  "blog:latestPosts": BlogLatestStoriesSectionEditor,
  "blog:popularCategories": BlogCategoryNavSectionEditor,
  "blog:editorsPicks": BlogEditorsPicksSectionEditor,
  "blog:trendingPosts": BlogTrendingStoriesSectionEditor,
  "blog:newsletter": BlogNewsletterSectionEditor,
};

/**
 * Returns the mapped React editor component for a given page and section key combination.
 * Throws an explicit error during development if no editor is registered.
 */
export function getSectionEditor(
  pageKey: ContentPageKey,
  sectionId: string
): React.ComponentType<any> {
  const specificKey = `${pageKey}:${sectionId}`;
  const sharedKey = `*:${sectionId}`;
  
  const component = editorMap[specificKey] || editorMap[sharedKey];
  
  if (!component) {
    throw new Error(
      `No editor registered in section-editor.registry.tsx for page: "${pageKey}", section: "${sectionId}". Every registered section must have an editor component.`
    );
  }
  
  return component;
}
