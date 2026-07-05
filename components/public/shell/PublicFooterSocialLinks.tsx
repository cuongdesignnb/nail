import { Facebook, Instagram, Link as LinkIcon, Music2, Phone, Youtube } from "lucide-react";
import type { NavigationMenuItem } from "@/lib/navigation/navigation.types";
import styles from "./PublicFooter.module.css";

function SocialIcon({ item }: { item: NavigationMenuItem }) {
  const icon = `${item.icon || ""} ${item.label || ""} ${item.href || ""}`;
  if (/instagram/i.test(icon)) return <Instagram size={17} />;
  if (/facebook/i.test(icon)) return <Facebook size={17} />;
  if (/tiktok/i.test(icon)) return <Music2 size={17} />;
  if (/youtube/i.test(icon)) return <Youtube size={17} />;
  if (/whatsapp/i.test(icon)) return <Phone size={17} />;
  return <LinkIcon size={17} />;
}

export function PublicFooterSocialLinks({ items }: { items: NavigationMenuItem[] }) {
  const visible = items.filter((item) => item.isEnabled !== false && item.href);
  if (!visible.length) return null;
  return (
    <div className={styles.socialLinks} aria-label="Social links">
      {visible.map((item) => (
        <a className={styles.socialLink} key={item.id} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.label} title={item.label}>
          <SocialIcon item={item} />
        </a>
      ))}
    </div>
  );
}
