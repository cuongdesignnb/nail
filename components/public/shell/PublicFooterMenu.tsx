import type { NavigationMenuItem } from "@/lib/navigation/navigation.types";
import { SafePublicLink } from "./SafePublicLink";
import styles from "./PublicFooter.module.css";

function visibleItems(items: NavigationMenuItem[]) {
  return items.filter((item) => item.isEnabled !== false);
}

export function PublicFooterLink({ item, className = styles.link }: { item: NavigationMenuItem; className?: string }) {
  return <SafePublicLink item={item} className={className} />;
}

export function PublicFooterMenu({ title, items }: { title: string; items: NavigationMenuItem[] }) {
  const visible = items.filter((item) => item.isEnabled !== false);
  if (!visible.length) return null;
  return (
    <section className={styles.menuColumn} aria-labelledby={`footer-${title.toLowerCase()}-heading`}>
      <h2 className={styles.heading} id={`footer-${title.toLowerCase()}-heading`}>{title}</h2>
      <ul className={styles.menuList}>
        {visible.map((item) => (
          <li key={item.id}>
            <PublicFooterLink item={item} />
            {visibleItems(item.children || []).length > 0 && (
              <ul>
                {visibleItems(item.children || []).map((child) => (
                  <li key={child.id}>
                    <PublicFooterLink item={child} />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
