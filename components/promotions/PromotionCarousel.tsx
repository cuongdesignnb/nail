"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { PublicPromotionCampaign } from "@/lib/promotions/promotion.types";
import { PromotionCard } from "./PromotionCard";
import { PromotionClaimModal } from "./PromotionClaimModal";

export function PromotionCarousel({ campaigns }: { campaigns: PublicPromotionCampaign[] }) {
  const [index, setIndex] = useState(0);
  const [claimTarget, setClaimTarget] = useState<PublicPromotionCampaign | null>(null);
  if (!campaigns.length) return null;
  const active = campaigns[index % campaigns.length];

  return (
    <section className="promo-section" id="promotions">
      <div className="promo-section-heading">
        <span className="section-kicker">Happening Now</span>
        <h2>Current Promotions</h2>
        <p>Limited-time offers to elevate your nail care experience.</p>
      </div>
      <div className="promo-carousel">
        <button type="button" className="promo-arrow" aria-label="Previous promotion" onClick={() => setIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length)}>
          <ChevronLeft size={20} />
        </button>
        <div className="promo-carousel-window">
          <AnimatePresence mode="wait">
            <motion.div key={active.id} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.28 }}>
              <PromotionCard campaign={active} onClaim={setClaimTarget} />
            </motion.div>
          </AnimatePresence>
        </div>
        <button type="button" className="promo-arrow" aria-label="Next promotion" onClick={() => setIndex((prev) => (prev + 1) % campaigns.length)}>
          <ChevronRight size={20} />
        </button>
      </div>
      <div className="promo-dots" aria-label="Promotion slides">
        {campaigns.map((campaign, dotIndex) => (
          <button key={campaign.id} type="button" aria-label={`Show promotion ${dotIndex + 1}`} className={dotIndex === index ? "active" : ""} onClick={() => setIndex(dotIndex)} />
        ))}
      </div>
      <div className="promo-desktop-grid">
        {campaigns.slice(0, 3).map((campaign) => (
          <PromotionCard key={campaign.id} campaign={campaign} onClaim={setClaimTarget} />
        ))}
      </div>
      <PromotionClaimModal campaign={claimTarget} open={!!claimTarget} onClose={() => setClaimTarget(null)} />
    </section>
  );
}
