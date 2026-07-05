import Image from "next/image";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { getPublishedGlobalContent } from "@/lib/content/content.service";
import { getPublishedMobileMenu, getPublishedPrimaryMenu } from "@/lib/navigation/navigation.service";
import type { NavigationMenuItem } from "@/lib/navigation/navigation.types";

function HeaderLink({ item }: { item: NavigationMenuItem }) {
  if (item.type === "external" || item.type === "mailto" || item.type === "tel") {
    return (
      <a href={item.href} target={item.type === "external" ? "_blank" : item.target} rel={item.type === "external" ? "noopener noreferrer" : undefined}>
        {item.label}
      </a>
    );
  }
  return <Link href={item.href || "/"}>{item.label}</Link>;
}

export async function PublicHeader() {
  const [global, primaryMenu, mobileMenu] = await Promise.all([
    getPublishedGlobalContent(),
    getPublishedPrimaryMenu(),
    getPublishedMobileMenu(),
  ]);
  const brandName = global?.brand?.name || "Aera Nail Lounge";
  const logoSrc = global?.brand?.logo?.src || "/aera-mark.svg";
  const logoAlt = global?.brand?.logo?.alt || brandName;
  const ctaLabel = global?.headerNav?.cta?.label || "Book Now";
  const ctaHref = global?.headerNav?.cta?.href || "/booking";

  return (
    <header className="site-header inner-header">
      <Link className="logo" href="/" aria-label={`${brandName} home`}>
        <Image src={logoSrc} alt={logoAlt} width={58} height={58} />
        <span>{brandName}</span>
      </Link>
      <nav aria-label="Primary navigation">
        {primaryMenu.map((item) => (
          <HeaderLink key={item.id} item={item} />
        ))}
      </nav>
      <nav className="sr-only" aria-label="Mobile navigation">
        {mobileMenu.map((item) => (
          <HeaderLink key={item.id} item={item} />
        ))}
      </nav>
      <Link className="book-top" href={ctaHref}>
        <CalendarCheck size={17} />
        {ctaLabel}
      </Link>
    </header>
  );
}
