export type PublicPromotionCampaign = {
  id: string;
  title: string;
  subtitle?: string | null;
  eyebrow?: string | null;
  badge?: string | null;
  description?: string | null;
  policyNote?: string | null;
  ctaLabel?: string | null;
  imageUrl?: string | null;
  showOnHomepage?: boolean;
  popupEnabled?: boolean;
  triggerType?: "SCROLL_PERCENT" | "SECTION_VISIBLE" | "DELAY_ONLY";
  scrollPercent?: number;
  delaySeconds?: number;
  frequencyHours?: number;
  sortOrder?: number;
};
