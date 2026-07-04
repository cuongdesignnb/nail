/**
 * Content Hub Migration Script
 *
 * Seeds the SitePageContent table with default content for all 9 page keys.
 * This script is idempotent — safe to run multiple times.
 * Existing records are never overwritten.
 *
 * Usage: npm run data:migrate-content-hub
 *        (or: npx tsx scripts/migrate-page-content-to-content-hub.ts)
 */

import { PrismaClient, Prisma } from "@prisma/client";

/* ------------------------------------------------------------------ */
/*  Import default content from existing data files                   */
/* ------------------------------------------------------------------ */

import { defaultAboutContent } from "../data/about.default";
import { defaultServicesContent } from "../data/services.default";
import { defaultGalleryContent } from "../data/gallery.default";
import { defaultPackagesContent } from "../data/packages.default";
import { defaultBlogContent } from "../data/blog.default";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

import type {
  ContentPageKey,
  HomePageContent,
  PromotionsPageContent,
  ContactPageContent,
  GlobalContent,
} from "../lib/content/content.types";

/* ------------------------------------------------------------------ */
/*  The 9 page keys                                                   */
/* ------------------------------------------------------------------ */

const PAGE_KEYS: ContentPageKey[] = [
  "home",
  "about",
  "services",
  "gallery",
  "packages",
  "promotions",
  "contact",
  "blog",
  "global",
];

/* ------------------------------------------------------------------ */
/*  Default inline content for pages without dedicated data files     */
/* ------------------------------------------------------------------ */

const defaultHomeContent: HomePageContent = {
  seo: {
    title: "Aera Nail Lounge | Luxury Nail Care",
    description:
      "Experience premium manicures, pedicures, nail art, and spa treatments at Aera Nail Lounge.",
  },
  hero: {
    eyebrow: "WELCOME TO AERA NAIL LOUNGE",
    title: "Elevate Your Beauty,",
    highlight: "Define Your Style",
    description:
      "Experience luxury nail care in a serene, modern setting. From timeless manicures to custom nail art, we bring precision and elegance to every visit.",
    image: {
      src: "/images/about-hero-nail.jpg",
      alt: "Luxury nail care at Aera Nail Lounge",
    },
    primaryButton: {
      label: "Book Your Appointment",
      href: "/booking",
      variant: "primary",
    },
    secondaryButton: {
      label: "Explore Services",
      href: "/services",
      variant: "secondary",
    },
  },
  signatureServices: {
    eyebrow: "OUR SERVICES",
    title: "Signature Services",
    description:
      "Discover our curated selection of premium nail care treatments.",
    featuredServiceIds: [],
    showViewAll: true,
  },
  aboutPreview: {
    eyebrow: "ABOUT US",
    title: "Crafted with Care & Precision",
    description:
      "At Aera Nail Lounge, we combine artistry with hygiene-first practices to deliver a luxurious nail experience you can trust.",
    image: {
      src: "/images/about-hero-nail.jpg",
      alt: "Aera Nail Lounge interior",
    },
    button: {
      label: "Learn More",
      href: "/about",
    },
  },
  featuredGallery: {
    eyebrow: "OUR WORK",
    title: "Nail Art Gallery",
    featuredItemIds: [],
    showViewAll: true,
  },
  packagesPreview: {
    eyebrow: "VALUE PACKAGES",
    title: "Curated Packages",
    description:
      "Save more with our thoughtfully designed packages for every occasion.",
    featuredPackageIds: [],
  },
  promotionBanner: {
    isVisible: false,
    title: "Special Offers",
    description: "Check out our latest promotions and exclusive deals.",
    code: "",
    button: {
      label: "View Promotions",
      href: "/promotions",
    },
    featuredPromotionIds: [],
  },
  teamPreview: {
    eyebrow: "OUR TEAM",
    title: "Meet Our Experts",
    featuredTechnicianIds: [],
  },
  testimonials: {
    eyebrow: "TESTIMONIALS",
    title: "What Our Clients Say",
    items: [],
  },
  bookingSteps: {
    eyebrow: "HOW IT WORKS",
    title: "Book in 3 Simple Steps",
    steps: [
      {
        id: "step-1",
        step: "01",
        icon: "Calendar",
        title: "Choose Your Service",
        description:
          "Browse our services and select the perfect treatment for you.",
      },
      {
        id: "step-2",
        step: "02",
        icon: "Clock",
        title: "Pick a Time",
        description:
          "Choose a convenient date and time that works for your schedule.",
      },
      {
        id: "step-3",
        step: "03",
        icon: "Sparkles",
        title: "Enjoy Your Visit",
        description:
          "Relax and let our experts take care of the rest. You deserve it.",
      },
    ],
  },
  instagramPreview: {
    eyebrow: "FOLLOW US",
    title: "Get Inspired on Instagram",
    instagramUrl: "https://www.instagram.com/aeranaillounge",
    showSection: true,
  },
  faq: {
    eyebrow: "FAQ",
    title: "Frequently Asked Questions",
    items: [],
  },
  finalCta: {
    title: "Ready to Experience Luxury Nail Care?",
    description:
      "Book your appointment today and discover the Aera Nail Lounge difference.",
    button: {
      label: "Book Now",
      href: "/booking",
    },
    phone: "(555) 123-4567",
    email: "hello@aeranaillounge.com",
    address: "123 Beauty Lane, City, ST 10001",
    hours: "Mon–Sat: 9:30 AM – 7:00 PM | Sun: 10:00 AM – 5:00 PM",
  },
};

const defaultPromotionsContent: PromotionsPageContent = {
  seo: {
    title: "Promotions & Special Offers | Aera Nail Lounge",
    description:
      "Discover exclusive deals, seasonal promotions, and loyalty rewards at Aera Nail Lounge.",
  },
  hero: {
    eyebrow: "EXCLUSIVE OFFERS",
    title: "Special Promotions &",
    highlight: "Seasonal Deals",
    description:
      "Take advantage of our curated promotions designed to help you look and feel your best — for less.",
    image: {
      src: "/images/about-hero-nail.jpg",
      alt: "Promotions at Aera Nail Lounge",
    },
    primaryButton: {
      label: "Book Now",
      href: "/booking",
      variant: "primary",
    },
    secondaryButton: {
      label: "View All Offers",
      href: "#promotions",
      variant: "secondary",
    },
  },
  promotionIntro: {
    eyebrow: "CURRENT PROMOTIONS",
    title: "Our Latest Offers",
    description:
      "Explore our currently running promotions and find the perfect deal for your next visit.",
  },
  featuredPromotions: {
    title: "Featured Promotions",
    featuredPromotionIds: [],
    showAll: true,
  },
  termsAndConditions: {
    title: "Terms & Conditions",
    content:
      "Promotions cannot be combined with other offers unless otherwise stated. Valid at participating locations only.",
  },
  howToRedeem: {
    title: "How to Redeem",
    steps: [
      {
        id: "redeem-1",
        step: "01",
        icon: "Search",
        title: "Find Your Offer",
        description: "Browse our current promotions and choose your favorite.",
      },
      {
        id: "redeem-2",
        step: "02",
        icon: "Calendar",
        title: "Book Your Appointment",
        description:
          "Schedule your visit and mention the promotion during booking.",
      },
      {
        id: "redeem-3",
        step: "03",
        icon: "Sparkles",
        title: "Enjoy & Save",
        description:
          "Show up, relax, and enjoy your service at the promotional price.",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [],
  },
  finalCta: {
    title: "Don't Miss Out on These Deals",
    description:
      "Book your appointment today and enjoy exclusive savings at Aera Nail Lounge.",
    button: {
      label: "Book Now",
      href: "/booking",
    },
    phone: "(555) 123-4567",
    email: "hello@aeranaillounge.com",
    address: "123 Beauty Lane, City, ST 10001",
    hours: "Mon–Sat: 9:30 AM – 7:00 PM | Sun: 10:00 AM – 5:00 PM",
  },
};

const defaultContactContent: ContactPageContent = {
  seo: {
    title: "Contact Us | Aera Nail Lounge",
    description:
      "Get in touch with Aera Nail Lounge. Find our address, hours, phone number, and send us a message.",
  },
  hero: {
    eyebrow: "GET IN TOUCH",
    title: "We'd Love to",
    highlight: "Hear from You",
    description:
      "Have a question or want to book? Reach out and our team will get back to you promptly.",
    image: {
      src: "/images/about-hero-nail.jpg",
      alt: "Contact Aera Nail Lounge",
    },
    primaryButton: {
      label: "Book an Appointment",
      href: "/booking",
      variant: "primary",
    },
    secondaryButton: {
      label: "Call Us",
      href: "tel:+15551234567",
      variant: "secondary",
    },
  },
  contactInfo: {
    phone: "(555) 123-4567",
    email: "hello@aeranaillounge.com",
    address: "123 Beauty Lane, City, ST 10001",
    googleMapsUrl: "https://maps.google.com",
  },
  openingHours: {
    title: "Opening Hours",
    schedule: [
      { id: "hours-1", days: "Monday – Friday", hours: "9:30 AM – 7:00 PM" },
      { id: "hours-2", days: "Saturday", hours: "9:00 AM – 7:00 PM" },
      { id: "hours-3", days: "Sunday", hours: "10:00 AM – 5:00 PM" },
    ],
  },
  mapLocation: {
    title: "Find Us",
    googleMapsEmbedUrl: "",
  },
  contactForm: {
    title: "Send Us a Message",
    description:
      "Fill out the form below and we will get back to you within 24 hours.",
    submitLabel: "Send Message",
  },
  socialLinks: {
    instagramUrl: "https://www.instagram.com/aeranaillounge",
    facebookUrl: "https://www.facebook.com/aeranaillounge",
    tiktokUrl: "https://www.tiktok.com/@aeranaillounge",
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [],
  },
  finalCta: {
    title: "Ready to Visit?",
    description:
      "Book your appointment online or give us a call — we can't wait to pamper you.",
    button: {
      label: "Book Now",
      href: "/booking",
    },
    phone: "(555) 123-4567",
    email: "hello@aeranaillounge.com",
    address: "123 Beauty Lane, City, ST 10001",
    hours: "Mon–Sat: 9:30 AM – 7:00 PM | Sun: 10:00 AM – 5:00 PM",
  },
};

const defaultGlobalContent: GlobalContent = {
  brand: {
    name: "Aera Nail Lounge",
    logo: {
      src: "/images/logo-aera.png",
      alt: "Aera Nail Lounge logo",
    },
    tagline: "Elevate Your Beauty, Define Your Style",
  },
  headerNav: {
    items: [
      { id: "nav-home", label: "Home", href: "/" },
      { id: "nav-about", label: "About", href: "/about" },
      { id: "nav-services", label: "Services", href: "/services" },
      { id: "nav-gallery", label: "Gallery", href: "/gallery" },
      { id: "nav-packages", label: "Packages", href: "/packages" },
      { id: "nav-blog", label: "Beauty Journal", href: "/blog" },
      { id: "nav-contact", label: "Contact", href: "/contact" },
    ],
    cta: {
      label: "Book Now",
      href: "/booking",
      variant: "primary",
    },
  },
  footer: {
    brandText:
      "Aera Nail Lounge — where artistry meets hygiene-first luxury nail care.",
    quickLinks: [
      { id: "fl-home", label: "Home", href: "/" },
      { id: "fl-about", label: "About", href: "/about" },
      { id: "fl-services", label: "Services", href: "/services" },
      { id: "fl-gallery", label: "Gallery", href: "/gallery" },
      { id: "fl-packages", label: "Packages", href: "/packages" },
      { id: "fl-blog", label: "Beauty Journal", href: "/blog" },
      { id: "fl-contact", label: "Contact", href: "/contact" },
    ],
    serviceLinks: [
      { id: "sl-mani", label: "Manicure", href: "/services#manicure" },
      { id: "sl-pedi", label: "Pedicure", href: "/services#pedicure" },
      { id: "sl-gel", label: "Gel Polish", href: "/services#gel" },
      { id: "sl-art", label: "Nail Art", href: "/services#nail-art" },
    ],
    contact: {
      phone: "(555) 123-4567",
      email: "hello@aeranaillounge.com",
      address: "123 Beauty Lane, City, ST 10001",
      hours: "Mon–Sat: 9:30 AM – 7:00 PM | Sun: 10:00 AM – 5:00 PM",
    },
    newsletter: {
      title: "Stay in Touch",
      description:
        "Subscribe to receive beauty tips, exclusive offers, and salon updates.",
      placeholder: "Enter your email",
    },
    copyright: "© {year} Aera Nail Lounge. All rights reserved.",
  },
  socialLinks: {
    instagramUrl: "https://www.instagram.com/aeranaillounge",
    facebookUrl: "https://www.facebook.com/aeranaillounge",
    tiktokUrl: "https://www.tiktok.com/@aeranaillounge",
  },
  defaultContact: {
    phone: "(555) 123-4567",
    email: "hello@aeranaillounge.com",
    address: "123 Beauty Lane, City, ST 10001",
    hours: "Mon–Sat: 9:30 AM – 7:00 PM | Sun: 10:00 AM – 5:00 PM",
  },
  defaultShareImage: {
    src: "/images/about-hero-nail.jpg",
    alt: "Aera Nail Lounge — Luxury Nail Care",
  },
};

/* ------------------------------------------------------------------ */
/*  Map page key → default content                                    */
/* ------------------------------------------------------------------ */

function getDefaultContentForKey(
  key: ContentPageKey
): Record<string, unknown> {
  switch (key) {
    case "home":
      return defaultHomeContent as unknown as Record<string, unknown>;
    case "about":
      return defaultAboutContent as unknown as Record<string, unknown>;
    case "services":
      return defaultServicesContent as unknown as Record<string, unknown>;
    case "gallery":
      return defaultGalleryContent as unknown as Record<string, unknown>;
    case "packages":
      return defaultPackagesContent as unknown as Record<string, unknown>;
    case "promotions":
      return defaultPromotionsContent as unknown as Record<string, unknown>;
    case "contact":
      return defaultContactContent as unknown as Record<string, unknown>;
    case "blog":
      return defaultBlogContent as unknown as Record<string, unknown>;
    case "global":
      return defaultGlobalContent as unknown as Record<string, unknown>;
    default:
      throw new Error(`Unknown page key: ${key}`);
  }
}

/* ------------------------------------------------------------------ */
/*  Main migration                                                    */
/* ------------------------------------------------------------------ */

const prisma = new PrismaClient();

async function main() {
  console.log("╔══════════════════════════════════════════════╗");
  console.log("║  Content Hub Migration                      ║");
  console.log("║  Seeding SitePageContent for all page keys  ║");
  console.log("╚══════════════════════════════════════════════╝");
  console.log("");

  let created = 0;
  let skipped = 0;

  for (const pageKey of PAGE_KEYS) {
    // Check if a record already exists for this slug
    const existing = await prisma.sitePageContent.findUnique({
      where: { slug: pageKey },
    });

    if (existing) {
      console.log(`  ⏭  Skipping "${pageKey}" — record already exists (id: ${existing.id})`);
      skipped++;
      continue;
    }

    // Get default content
    const defaultContent = getDefaultContentForKey(pageKey);

    // Create the record
    await prisma.sitePageContent.create({
      data: {
        slug: pageKey,
        draftContent: defaultContent as Prisma.InputJsonValue,
        publishedContent: Prisma.JsonNull,
        version: 1,
        updatedBy: "migration-script",
      },
    });

    console.log(`  ✅  Created "${pageKey}" with default content`);
    created++;
  }

  console.log("");
  console.log("────────────────────────────────────────────────");
  console.log(`  Results: ${created} created, ${skipped} skipped (already existed)`);
  console.log("────────────────────────────────────────────────");
  console.log("");
  console.log("Migration complete!");
}

main()
  .catch((error) => {
    console.error("");
    console.error("❌ Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
