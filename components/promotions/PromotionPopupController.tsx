"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { PublicPromotionCampaign } from "@/lib/promotions/promotion.types";
import { PromotionClaimModal } from "./PromotionClaimModal";

function isSuppressedPath(pathname: string) {
  return pathname.startsWith("/admin") || pathname.startsWith("/booking") || pathname.startsWith("/gift-cards");
}

function recentlyStored(key: string, frequencyHours: number) {
  try {
    const value = Number(localStorage.getItem(key) || 0);
    return value > 0 && Date.now() - value < frequencyHours * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export function PromotionPopupController({ campaign }: { campaign: PublicPromotionCampaign | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!campaign || isSuppressedPath(pathname)) return;
    const frequency = campaign.frequencyHours || 24;
    const closeKey = `aera_promo_popup_closed_${campaign.id}`;
    const claimKey = `aera_promo_popup_claimed_${campaign.id}`;
    if (recentlyStored(closeKey, frequency) || recentlyStored(claimKey, 24 * 365)) return;

    let delayDone = false;
    let scrollDone = campaign.triggerType === "DELAY_ONLY";
    const maybeOpen = () => {
      if (delayDone && scrollDone) setOpen(true);
    };
    const timer = window.setTimeout(() => {
      delayDone = true;
      maybeOpen();
    }, (campaign.delaySeconds ?? 3) * 1000);
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const percent = total > 0 ? (window.scrollY / total) * 100 : 100;
      if (percent >= (campaign.scrollPercent || 40)) {
        scrollDone = true;
        maybeOpen();
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [campaign, pathname]);

  if (!campaign) return null;
  return (
    <PromotionClaimModal
      campaign={campaign}
      open={open}
      onClose={() => {
        try {
          localStorage.setItem(`aera_promo_popup_closed_${campaign.id}`, String(Date.now()));
        } catch {}
        setOpen(false);
      }}
    />
  );
}
