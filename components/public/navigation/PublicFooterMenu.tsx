import Link from "next/link";
import { Facebook, Instagram, Link as LinkIcon, Music2, Youtube } from "lucide-react";
import type { NavigationMenuItem } from "@/lib/navigation/navigation.types";

export function PublicMenuLink({ item, className }: { item: NavigationMenuItem; className?: string }) {
  if (item.type === "external" || item.type === "mailto" || item.type === "tel") {
    return (
      <a
        className={className}
        href={item.href}
        target={item.type === "external" ? "_blank" : item.target}
        rel={item.type === "external" ? "noopener noreferrer" : undefined}
      >
        {item.label}
      </a>
    );
  }
  return <Link className={className} href={item.href || "/"}>{item.label}</Link>;
}

export function PublicFooterMenu({ title, items }: { title: string; items: NavigationMenuItem[] }) {
  const visible = items.filter((item) => item.isEnabled !== false);
  if (!visible.length) return null;
  return (
    <div>
      <h3>{title}</h3>
      {visible.map((item) => (
        <PublicMenuLink key={item.id} item={item} />
      ))}
    </div>
  );
}

export function PublicFooterSocialMenu({ items }: { items: NavigationMenuItem[] }) {
  const visible = items.filter((item) => item.isEnabled !== false);
  if (!visible.length) return null;
  return (
    <div className="footer-social-row" aria-label="Social links">
      {visible.map((item) => (
        <a
          key={item.id}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          title={item.label}
        >
          <SocialIcon item={item} />
        </a>
      ))}
    </div>
  );
}

export function PublicFooterLegalMenu({ items }: { items: NavigationMenuItem[] }) {
  const visible = items.filter((item) => item.isEnabled !== false);
  if (!visible.length) return null;
  return (
    <nav className="footer-legal-row" aria-label="Legal links">
      {visible.map((item) => (
        <PublicMenuLink key={item.id} item={item} />
      ))}
    </nav>
  );
}

function SocialIcon({ item }: { item: NavigationMenuItem }) {
  const icon = item.icon || item.label;
  if (/instagram/i.test(icon)) return <Instagram size={18} />;
  if (/facebook/i.test(icon)) return <Facebook size={18} />;
  if (/tiktok/i.test(icon)) return <Music2 size={18} />;
  if (/youtube/i.test(icon)) return <Youtube size={18} />;
  if (/pinterest/i.test(icon)) return <LinkIcon size={18} />;
  return <LinkIcon size={18} />;
}
