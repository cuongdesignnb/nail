import type { MediaReference } from "@/lib/media/media.types";
import type { BookingPolicies, BusinessHour } from "./settings.types";

export type PublicSiteSettings = {
  brand: {
    name: string;
    tagline: string;
    logo: MediaReference | null;
    favicon: MediaReference | null;
  };
  contact: {
    phone: string;
    phoneE164: string;
    phoneDigits: string;
    email: string;
    address: string;
    website: string;
    mapsUrl: string;
  };
  businessHours: BusinessHour[];
  businessHoursSummary: string;
  bookingPolicies: BookingPolicies;
  timezone: string;
  currency: string;
  socialLinks: {
    instagramUrl?: string;
    facebookUrl?: string;
    tiktokUrl?: string;
  };
};
