import type { NavigationLocation, NavigationMenuItem } from "./navigation.types";

export type NavigationLocationDefinition = {
  key: string;
  name: string;
  description: string;
  location: NavigationLocation;
  group: "Header Navigation" | "Footer Navigation";
  label: string;
  purpose: string;
};

export const NAVIGATION_LOCATIONS: NavigationLocationDefinition[] = [
  {
    key: "header-primary",
    name: "Primary Header Navigation",
    description: "Main desktop Header navigation.",
    location: "header_primary",
    group: "Header Navigation",
    label: "Primary Header Navigation",
    purpose: "Desktop Header",
  },
  {
    key: "header-mobile",
    name: "Mobile Navigation",
    description: "Optional custom mobile drawer navigation.",
    location: "header_mobile",
    group: "Header Navigation",
    label: "Mobile Navigation",
    purpose: "Mobile Header",
  },
  {
    key: "footer-company",
    name: "Footer Company",
    description: "Company and quick footer links.",
    location: "footer_company",
    group: "Footer Navigation",
    label: "Footer Company",
    purpose: "Footer company column",
  },
  {
    key: "footer-services",
    name: "Footer Services",
    description: "Services and packages footer links.",
    location: "footer_services",
    group: "Footer Navigation",
    label: "Footer Services",
    purpose: "Footer services column",
  },
  {
    key: "footer-explore",
    name: "Footer Explore",
    description: "Explore links for gallery, promotions, journal and booking.",
    location: "footer_explore",
    group: "Footer Navigation",
    label: "Footer Explore",
    purpose: "Footer explore column",
  },
  {
    key: "footer-legal",
    name: "Footer Legal",
    description: "Footer legal and policy links.",
    location: "footer_legal",
    group: "Footer Navigation",
    label: "Footer Legal",
    purpose: "Footer bottom row",
  },
  {
    key: "footer-social",
    name: "Footer Social",
    description: "Footer social profile links.",
    location: "footer_social",
    group: "Footer Navigation",
    label: "Footer Social",
    purpose: "Footer social row",
  },
];

function item(id: string, label: string, href: string, type: NavigationMenuItem["type"] = "internal", enabled = true): NavigationMenuItem {
  return { id, label, href, type, target: type === "external" ? "_blank" : "_self", isEnabled: enabled, children: [] };
}

export const DEFAULT_NAVIGATION_ITEMS: Record<NavigationLocation, NavigationMenuItem[]> = {
  header_primary: [
    item("nav-home", "Home", "/"),
    item("nav-about", "About", "/about"),
    item("nav-services", "Services", "/services"),
    item("nav-gallery", "Gallery", "/gallery"),
    item("nav-packages", "Packages", "/packages"),
    item("nav-gift-cards", "Gift Cards", "/gift-cards"),
    item("nav-promotions", "Promotions", "/promotions"),
    item("nav-blog", "Beauty Journal", "/blog"),
    item("nav-contact", "Contact", "/contact"),
  ],
  header_mobile: [],
  footer_company: [
    item("footer-company-home", "Home", "/"),
    item("footer-company-about", "About Aera", "/about"),
    item("footer-company-contact", "Contact", "/contact"),
    item("footer-company-booking", "Book Your Appointment", "/booking"),
  ],
  footer_services: [
    item("footer-services-all", "All Services", "/services"),
    item("footer-services-manicure", "Manicure", "/services"),
    item("footer-services-pedicure", "Pedicure", "/services"),
    item("footer-services-gel", "Gel Polish", "/services"),
    item("footer-services-art", "Nail Art", "/services"),
    item("footer-services-spa", "Spa Treatment", "/services"),
    item("footer-services-packages", "Nail Packages", "/packages"),
  ],
  footer_explore: [
    item("footer-explore-gallery", "Gallery", "/gallery"),
    item("footer-explore-promotions", "Promotions", "/promotions"),
    item("footer-explore-gift-cards", "Gift Cards", "/gift-cards"),
    item("footer-explore-blog", "Beauty Journal", "/blog"),
    item("footer-explore-booking", "Book Now", "/booking"),
  ],
  footer_legal: [
    item("footer-legal-privacy", "Privacy Policy", "/privacy-policy", "internal", false),
    item("footer-legal-terms", "Terms & Conditions", "/terms", "internal", false),
    item("footer-legal-gift-cards", "Gift Card Terms", "/gift-cards/terms"),
    item("footer-legal-booking", "Booking Policy", "/booking-policy", "internal", false),
    item("footer-legal-accessibility", "Accessibility", "/accessibility", "internal", false),
  ],
  footer_social: [
    item("footer-social-instagram", "Instagram", "https://www.instagram.com/", "external"),
    item("footer-social-facebook", "Facebook", "https://www.facebook.com/", "external"),
    item("footer-social-tiktok", "TikTok", "https://www.tiktok.com/", "external"),
  ],
};

export function getNavigationLocation(location: string) {
  return NAVIGATION_LOCATIONS.find((entry) => entry.location === location || entry.key === location);
}
