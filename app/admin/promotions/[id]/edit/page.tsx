"use client";

import { useParams } from "next/navigation";
import PromotionForm from "@/components/admin/promotions/PromotionForm";

export default function EditPromotionPage() {
  const params = useParams();
  const id = params.id as string;

  return <PromotionForm promotionId={id} />;
}
