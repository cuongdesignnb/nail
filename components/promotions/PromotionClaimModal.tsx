"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import type { PublicPromotionCampaign } from "@/lib/promotions/promotion.types";
import { PromotionLeadForm } from "./PromotionLeadForm";
import { PromotionSuccessState } from "./PromotionSuccessState";
import { useState } from "react";

export function PromotionClaimModal({
  campaign,
  open,
  onClose,
}: {
  campaign: PublicPromotionCampaign | null;
  open: boolean;
  onClose: () => void;
}) {
  const [success, setSuccess] = useState("");
  if (!open || !campaign) return null;

  return (
    <div className="promo-modal-backdrop" role="dialog" aria-modal="true" aria-label={campaign.title}>
      <motion.div className="promo-modal" initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }}>
        <button type="button" className="promo-modal-close" onClick={onClose} aria-label="Close promotion">
          <X size={18} />
        </button>
        <div className="promo-modal-media">
          <Image src={campaign.imageUrl || "/images/salon-experience-2.jpg"} alt={campaign.title} fill sizes="(max-width: 768px) 100vw, 360px" />
        </div>
        <div className="promo-modal-content">
          {campaign.badge && <span className="promo-modal-badge">{campaign.badge}</span>}
          {campaign.eyebrow && <p className="promo-card-eyebrow">{campaign.eyebrow}</p>}
          <h2>{campaign.title}</h2>
          {campaign.description && <p>{campaign.description}</p>}
          {campaign.policyNote && <small>{campaign.policyNote}</small>}
          {success ? <PromotionSuccessState message={success} /> : <PromotionLeadForm campaign={campaign} onSuccess={setSuccess} />}
          {!success && (
            <button type="button" className="promo-no-thanks" onClick={onClose}>
              No thanks
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
