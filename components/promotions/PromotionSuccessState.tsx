"use client";

import { CheckCircle2 } from "lucide-react";

export function PromotionSuccessState({ message }: { message: string }) {
  return (
    <div className="promo-success-state">
      <CheckCircle2 size={42} />
      <h3>Your voucher is on its way.</h3>
      <p>{message || "Please check your email for your voucher code."}</p>
    </div>
  );
}
