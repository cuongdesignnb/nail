import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import type { ButtonField } from "@/lib/content/content.types";

export function PublicHeaderCta({ cta, onClick }: { cta: ButtonField | null; onClick?: () => void }) {
  if (!cta?.label || !cta.href) return null;
  return (
    <Link className="aera-public-header__cta" href={cta.href} onClick={onClick}>
      <CalendarCheck size={17} />
      <span>{cta.label}</span>
    </Link>
  );
}
