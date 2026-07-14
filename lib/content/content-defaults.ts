/**
 * Content Hub CMS — Content Defaults
 *
 * Single source of truth for every page's default (seed) content.
 * Existing pages re-export their established defaults; new page types
 * (home, promotions, contact, global) are defined inline.
 */

import type {
  ContentPageKey,
  HomePageContent,
  PromotionsPageContent,
  ContactPageContent,
  GlobalContent,
} from "./content.types";

import { defaultAboutContent } from "@/data/about.default";
import { defaultServicesContent } from "@/data/services.default";
import { defaultGalleryContent } from "@/data/gallery.default";
import { defaultPackagesContent } from "@/data/packages.default";
import { defaultBlogContent } from "@/data/blog.default";

/* ------------------------------------------------------------------ */
/*  Home Page                                                          */
/* ------------------------------------------------------------------ */

export const defaultHomeContent: HomePageContent = {
  seo: {
    title: "Aera Nail Lounge | Luxury Nail Care & Art",
    description:
      "Welcome to Aera Nail Lounge — experience premium manicures, pedicures, nail art, and spa treatments in a relaxing, refined atmosphere.",
  },
  hero: {
    eyebrow: "WELCOME TO AERA NAIL LOUNGE",
    title: "Luxury Nail Care,",
    highlight: "Designed for You",
    description:
      "Experience premium nail services, bespoke designs, and relaxing spa treatments crafted to enhance your beauty and well-being.",
    image: {
      src: "/images/about-hero-nail.jpg",
      alt: "Elegant luxury manicure at Aera Nail Lounge",
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
    title: "Signature Nail Experiences",
    description:
      "From classic manicures to custom nail art, discover the services that make Aera Nail Lounge a destination for refined beauty.",
    featuredServiceIds: [],
    showViewAll: true,
  },
  aboutPreview: {
    eyebrow: "ABOUT US",
    title: "Where Beauty, Comfort & Care Come Together",
    description:
      "At Aera Nail Lounge, we believe self-care is an art. Our mission is to create a luxurious escape where elegance, hygiene, and genuine care make every visit unforgettable.",
    image: {
      src: "/images/about-hero-nail.jpg",
      alt: "Aera Nail Lounge interior and ambience",
    },
    button: {
      label: "Learn More About Us",
      href: "/about",
      variant: "secondary",
    },
  },
  featuredGallery: {
    eyebrow: "NAIL ART GALLERY",
    title: "Inspiration for Your Next Look",
    featuredItemIds: [],
    showViewAll: true,
  },
  packagesPreview: {
    eyebrow: "PACKAGES & MEMBERSHIPS",
    title: "Curated Packages for Every Beauty Ritual",
    description:
      "Enjoy more value, more care, and more reasons to glow with our thoughtfully designed packages.",
    featuredPackageIds: [],
  },
  promotionBanner: {
    isVisible: false,
    title: "Special Offer",
    description: "Check out our latest promotions and exclusive deals.",
    code: "",
    button: {
      label: "View Promotions",
      href: "/promotions",
      variant: "primary",
    },
    featuredPromotionIds: [],
  },
  teamPreview: {
    eyebrow: "MEET OUR EXPERTS",
    title: "Artists Behind Your Perfect Nails",
    featuredTechnicianIds: [],
  },
  testimonials: {
    eyebrow: "WHAT OUR CLIENTS SAY",
    title: "Trusted by Hundreds of Happy Clients",
    items: [
      {
        id: "home-test-1",
        name: "Jessica M.",
        role: "Verified Client",
        rating: 5,
        quote:
          "Aera Nail Lounge is my happy place! The team is so professional and kind. My nails always look perfect and last so long!",
      },
      {
        id: "home-test-2",
        name: "Olivia T.",
        role: "Verified Client",
        rating: 5,
        quote:
          "The ambiance is so relaxing and luxurious. I love how clean and organized everything is. Highly recommend!",
      },
      {
        id: "home-test-3",
        name: "Sophia C.",
        role: "Verified Client",
        rating: 5,
        quote:
          "The most relaxing nail experience! The staff is friendly, professional, and always helps me find the perfect nail inspirations.",
      },
    ],
  },
  bookingSteps: {
    eyebrow: "HOW IT WORKS",
    title: "Book Your Appointment in 3 Easy Steps",
    steps: [
      {
        id: "home-step-1",
        step: "01",
        icon: "mouse-pointer",
        title: "Choose Your Service",
        description:
          "Browse our services and packages to find your perfect nail experience.",
      },
      {
        id: "home-step-2",
        step: "02",
        icon: "calendar-days",
        title: "Pick Your Time",
        description:
          "Select a convenient date and time from our online booking system.",
      },
      {
        id: "home-step-3",
        step: "03",
        icon: "sparkles",
        title: "Enjoy & Glow",
        description:
          "Relax in our luxurious salon and leave with stunning, long-lasting nails.",
      },
    ],
  },
  instagramPreview: {
    eyebrow: "FOLLOW US",
    title: "Stay Inspired on Instagram",
    instagramUrl: "https://instagram.com/aeranailounge",
    showSection: true,
  },
  faq: {
    eyebrow: "FREQUENTLY ASKED QUESTIONS",
    title: "Everything You Need to Know",
    items: [
      {
        id: "home-faq-1",
        question: "Do I need an appointment?",
        answer:
          "We prefer appointments to ensure you receive unhurried, personalized service. However, walk-ins are welcome based on availability.",
      },
      {
        id: "home-faq-2",
        question: "What services do you offer?",
        answer:
          "We offer a full range of nail services including manicures, pedicures, gel polish, nail art, extensions, and spa treatments.",
      },
      {
        id: "home-faq-3",
        question: "How long do services take?",
        answer:
          "Manicures typically take 30–45 minutes, pedicures 45–60 minutes, and extensions with nail art up to 90–120 minutes.",
      },
    ],
  },
  finalCta: {
    title: "Ready for Your Perfect Nail Experience?",
    description:
      "Treat yourself to the elegance, comfort, and care you deserve. We can't wait to pamper you at Aera Nail Lounge.",
    button: {
      label: "Book Your Appointment",
      href: "/booking",
      variant: "primary",
    },
    phone: "(626) 555-7800",
    email: "hello@aeranailounge.com",
    address: "123 Luxe Ave, Suite 100, Los Angeles, CA 90001",
    hours: "Mon – Sun: 10:00 AM – 8:00 PM",
  },
};

/* ------------------------------------------------------------------ */
/*  Promotions Page                                                    */
/* ------------------------------------------------------------------ */

export const defaultPromotionsContent: PromotionsPageContent = {
  seo: {
    title: "Promotions & Special Offers | Aera Nail Lounge",
    description:
      "Discover exclusive deals, seasonal promotions, and limited-time offers at Aera Nail Lounge.",
  },
  hero: {
    eyebrow: "EXCLUSIVE OFFERS",
    title: "Special Deals for",
    highlight: "Beauty Lovers",
    description:
      "Take advantage of our limited-time promotions and exclusive savings designed to make your luxury nail experience even more rewarding.",
    image: {
      src: "/images/about-hero-nail.jpg",
      alt: "Aera Nail Lounge promotional offers",
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
    title: "Exclusive Deals Curated for You",
    description:
      "From seasonal specials to loyalty rewards, explore our latest offers and find the perfect deal for your next visit.",
  },
  featuredPromotions: {
    title: "Featured Promotions",
    featuredPromotionIds: [],
    showAll: true,
  },
  termsAndConditions: {
    title: "Terms & Conditions",
    content:
      "Promotions are subject to availability and may not be combined with other offers unless specified. Valid at Aera Nail Lounge only. Management reserves the right to modify or cancel promotions at any time.",
  },
  howToRedeem: {
    title: "How to Redeem",
    steps: [
      {
        id: "redeem-1",
        step: "01",
        icon: "search",
        title: "Browse Offers",
        description: "Explore our current promotions and find one that suits you.",
      },
      {
        id: "redeem-2",
        step: "02",
        icon: "calendar-days",
        title: "Book Your Visit",
        description:
          "Schedule your appointment and mention the promotion when booking.",
      },
      {
        id: "redeem-3",
        step: "03",
        icon: "sparkles",
        title: "Enjoy & Save",
        description:
          "Relax and enjoy your luxury service at the discounted rate.",
      },
    ],
  },
  faq: {
    title: "Promotions FAQ",
    items: [
      {
        id: "promo-faq-1",
        question: "Can I combine multiple promotions?",
        answer:
          "Unless stated otherwise, promotions cannot be combined with other offers or discounts.",
      },
      {
        id: "promo-faq-2",
        question: "Do promotions expire?",
        answer:
          "Yes, each promotion has specific validity dates. Please check the promotion details for expiry information.",
      },
      {
        id: "promo-faq-3",
        question: "Can I use a promotion for gift cards?",
        answer:
          "Promotions apply to services only and cannot be applied to gift card purchases unless explicitly stated.",
      },
    ],
  },
  finalCta: {
    title: "Don't Miss Out on Our Latest Offers",
    description:
      "Book your appointment today and take advantage of exclusive savings at Aera Nail Lounge.",
    button: {
      label: "Book Your Appointment",
      href: "/booking",
      variant: "primary",
    },
    phone: "(626) 555-7800",
    email: "hello@aeranailounge.com",
    address: "123 Luxe Ave, Suite 100, Los Angeles, CA 90001",
    hours: "Mon – Sun: 10:00 AM – 8:00 PM",
  },
};

/* ------------------------------------------------------------------ */
/*  Contact Page                                                       */
/* ------------------------------------------------------------------ */

export const defaultContactContent: ContactPageContent = {
  seo: {
    title: "Contact Us | Aera Nail Lounge",
    description:
      "Get in touch with Aera Nail Lounge. Find our address, phone number, email, opening hours, and directions.",
  },
  hero: {
    eyebrow: "GET IN TOUCH",
    title: "We'd Love to",
    highlight: "Hear from You",
    description:
      "Have a question, want to book an appointment, or just want to say hello? Reach out to our friendly team and we'll get back to you as soon as possible.",
    image: {
      src: "/images/about-hero-nail.jpg",
      alt: "Aera Nail Lounge contact and location",
    },
    primaryButton: {
      label: "Book Your Appointment",
      href: "/booking",
      variant: "primary",
    },
    secondaryButton: {
      label: "Call Us Now",
      href: "tel:+16265557800",
      variant: "secondary",
    },
  },
  contactInfo: {
    phone: "(626) 555-7800",
    email: "hello@aeranailounge.com",
    address: "123 Luxe Ave, Suite 100, Los Angeles, CA 90001",
    googleMapsUrl: "https://maps.google.com",
  },
  openingHours: {
    title: "Opening Hours",
    schedule: [
      { id: "hrs-1", days: "Monday – Friday", hours: "10:00 AM – 8:00 PM" },
      { id: "hrs-2", days: "Saturday", hours: "9:00 AM – 8:00 PM" },
      { id: "hrs-3", days: "Sunday", hours: "10:00 AM – 6:00 PM" },
    ],
  },
  mapLocation: {
    title: "Find Us",
    googleMapsEmbedUrl: "",
  },
  contactForm: {
    title: "Send Us a Message",
    description:
      "Fill out the form below and our team will respond within 24 hours.",
    submitLabel: "Send Message",
  },
  socialLinks: {
    instagramUrl: "https://instagram.com/aeranailounge",
    facebookUrl: "https://facebook.com/aeranailounge",
    tiktokUrl: "https://tiktok.com/@aeranailounge",
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        id: "contact-faq-1",
        question: "Do you accept walk-ins?",
        answer:
          "We prefer appointments to ensure you receive unhurried, personalized service. However, we do accept walk-ins based on availability.",
      },
      {
        id: "contact-faq-2",
        question: "Is there parking available?",
        answer:
          "Yes, we have complimentary parking available for all clients in the building lot.",
      },
      {
        id: "contact-faq-3",
        question: "How can I cancel or reschedule?",
        answer:
          "You can cancel or reschedule your appointment online or by calling us at least 24 hours in advance.",
      },
    ],
  },
  finalCta: {
    title: "Ready to Visit Aera Nail Lounge?",
    description:
      "Book your appointment today and experience luxury nail care in a warm, welcoming environment.",
    button: {
      label: "Book Your Appointment",
      href: "/booking",
      variant: "primary",
    },
    phone: "(626) 555-7800",
    email: "hello@aeranailounge.com",
    address: "123 Luxe Ave, Suite 100, Los Angeles, CA 90001",
    hours: "Mon – Sun: 10:00 AM – 8:00 PM",
  },
};

/* ------------------------------------------------------------------ */
/*  Global Content                                                     */
/* ------------------------------------------------------------------ */

export const defaultGlobalContent: GlobalContent = {
  brand: {
    name: "Aera Nail Lounge",
    logo: {
      src: "/images/logo-aera.png",
      alt: "Aera Nail Lounge logo",
    },
    tagline: "Luxury Nail Care & Art",
  },
  headerNav: {
    items: [
      { id: "nav-home", label: "Home", href: "/" },
      { id: "nav-about", label: "About", href: "/about" },
      { id: "nav-services", label: "Services", href: "/services" },
      { id: "nav-gallery", label: "Gallery", href: "/gallery" },
      { id: "nav-packages", label: "Packages", href: "/packages" },
      { id: "nav-promotions", label: "Promotions", href: "/promotions" },
      { id: "nav-blog", label: "Blog", href: "/blog" },
      { id: "nav-contact", label: "Contact", href: "/contact" },
    ],
    cta: {
      label: "Book Now",
      href: "/booking",
      variant: "primary",
      icon: "calendar",
    },
  },
  footer: {
    brandText:
      "Elevating your beauty with luxury nail care, artistry, and heartfelt hospitality.",
    quickLinks: [
      { id: "fl-home", label: "Home", href: "/" },
      { id: "fl-about", label: "About Us", href: "/about" },
      { id: "fl-services", label: "Our Services", href: "/services" },
      { id: "fl-packages", label: "Packages", href: "/packages" },
      { id: "fl-promotions", label: "Promotions", href: "/promotions" },
      { id: "fl-blog", label: "Blog", href: "/blog" },
    ],
    serviceLinks: [
      { id: "sl-mani", label: "Manicure", href: "/services/manicure" },
      { id: "sl-pedi", label: "Pedicure", href: "/services/pedicure" },
      { id: "sl-gel", label: "Gel Polish", href: "/services/gel-polish" },
      { id: "sl-art", label: "Nail Art", href: "/services/nail-art" },
      { id: "sl-ext", label: "Extensions", href: "/services/extensions" },
      { id: "sl-spa", label: "Spa Treatments", href: "/services/spa" },
    ],
    contact: {
      phone: "(626) 555-7800",
      email: "hello@aeranailounge.com",
      address: "123 Luxe Ave, Suite 100, Los Angeles, CA 90001",
      hours: "Mon – Sun: 10:00 AM – 8:00 PM",
    },
    newsletter: {
      title: "Stay Connected",
      description: "Subscribe for special offers and nail care tips.",
      placeholder: "Enter your email",
    },
    copyright: "© 2025 Aera Nail Lounge. All Rights Reserved.",
  },
  socialLinks: {
    instagramUrl: "https://instagram.com/aeranailounge",
    facebookUrl: "https://facebook.com/aeranailounge",
    tiktokUrl: "https://tiktok.com/@aeranailounge",
  },
  defaultContact: {
    phone: "(626) 555-7800",
    email: "hello@aeranailounge.com",
    address: "123 Luxe Ave, Suite 100, Los Angeles, CA 90001",
    hours: "Mon – Sun: 10:00 AM – 8:00 PM",
    website: "",
  },
  businessHours: [
    { day: "Monday", isOpen: true, startTime: "09:00", endTime: "19:00" },
    { day: "Tuesday", isOpen: true, startTime: "09:00", endTime: "19:00" },
    { day: "Wednesday", isOpen: true, startTime: "09:00", endTime: "19:00" },
    { day: "Thursday", isOpen: true, startTime: "09:00", endTime: "19:00" },
    { day: "Friday", isOpen: true, startTime: "09:00", endTime: "19:00" },
    { day: "Saturday", isOpen: true, startTime: "10:00", endTime: "18:00" },
    { day: "Sunday", isOpen: false, startTime: "10:00", endTime: "18:00" },
  ],
  bookingPolicies: {
    minAdvanceHours: 2,
    maxAdvanceDays: 30,
    cancellationWindowHours: 24,
    bufferMinutes: 15,
  },
  defaultShareImage: {
    src: "/images/about-hero-nail.jpg",
    alt: "Aera Nail Lounge — Luxury Nail Care & Art",
  },
};

/* ------------------------------------------------------------------ */
/*  Defaults Map                                                       */
/* ------------------------------------------------------------------ */

const contentDefaults: Record<ContentPageKey, Record<string, unknown>> = {
  home: defaultHomeContent as unknown as Record<string, unknown>,
  about: defaultAboutContent as unknown as Record<string, unknown>,
  services: defaultServicesContent as unknown as Record<string, unknown>,
  gallery: defaultGalleryContent as unknown as Record<string, unknown>,
  packages: defaultPackagesContent as unknown as Record<string, unknown>,
  promotions: defaultPromotionsContent as unknown as Record<string, unknown>,
  contact: defaultContactContent as unknown as Record<string, unknown>,
  blog: defaultBlogContent as unknown as Record<string, unknown>,
  global: defaultGlobalContent as unknown as Record<string, unknown>,
};

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Returns the default (seed) content for a given page key.
 * Useful for initial database seeding and as a fallback when
 * no persisted content exists yet.
 */
export function getDefaultContent(
  pageKey: ContentPageKey,
): Record<string, unknown> {
  const defaults = contentDefaults[pageKey];
  if (!defaults) {
    throw new Error(`No default content defined for page key: "${pageKey}"`);
  }
  // Return a deep clone so callers never mutate the originals
  return JSON.parse(JSON.stringify(defaults));
}
