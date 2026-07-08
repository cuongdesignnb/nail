"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { PublicPromotionCampaign } from "@/lib/promotions/promotion.types";

export function PromotionCard({ campaign, onClaim }: { campaign: PublicPromotionCampaign; onClaim: (campaign: PublicPromotionCampaign) => void }) {
  return (
    <article className="promo-card">
      <div className="promo-card-media">
        <Image
          src={campaign.imageUrl || "/images/salon-experience-2.jpg"}
          alt={campaign.title}
          fill
          sizes="(max-width: 768px) 92vw, 420px"
        />
        {campaign.badge && <span className="promo-card-badge">{campaign.badge}</span>}
      </div>
      <div className="promo-card-body">
        {campaign.eyebrow && <p className="promo-card-eyebrow">{campaign.eyebrow}</p>}
        <h3>{campaign.title}</h3>
        {campaign.subtitle && <strong>{campaign.subtitle}</strong>}
        {campaign.description && <p>{campaign.description}</p>}
        {campaign.policyNote && <small>{campaign.policyNote}</small>}
        <button type="button" onClick={() => onClaim(campaign)} className="promo-card-cta">
          {campaign.ctaLabel || "Send My Voucher"}
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}
