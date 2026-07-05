import Image from "next/image";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { getPublishedGlobalContent } from "@/lib/content/content.service";

export async function PublicHeader() {
  const global = await getPublishedGlobalContent();
  const brandName = global?.brand?.name || "Aera Nail Lounge";
  const logoSrc = global?.brand?.logo?.src || "/aera-mark.svg";
  const logoAlt = global?.brand?.logo?.alt || brandName;
  const navItems = global?.headerNav?.items || [
    { id: "home", label: "Home", href: "/" },
    { id: "about", label: "About", href: "/about" },
    { id: "services", label: "Services", href: "/services" },
    { id: "gallery", label: "Gallery", href: "/gallery" },
    { id: "packages", label: "Packages", href: "/packages" },
    { id: "promotions", label: "Promotions", href: "/promotions" },
    { id: "contact", label: "Contact", href: "/contact" }
  ];
  const ctaLabel = global?.headerNav?.cta?.label || "Book Now";
  const ctaHref = global?.headerNav?.cta?.href || "/booking";

  return (
    <header className="site-header inner-header">
      <Link className="logo" href="/" aria-label={`${brandName} home`}>
        <Image src={logoSrc} alt={logoAlt} width={58} height={58} />
        <span>{brandName}</span>
      </Link>
      <nav aria-label="Primary navigation">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>{item.label}</Link>
        ))}
      </nav>
      <Link className="book-top" href={ctaHref}>
        <CalendarCheck size={17} />
        {ctaLabel}
      </Link>
    </header>
  );
}
