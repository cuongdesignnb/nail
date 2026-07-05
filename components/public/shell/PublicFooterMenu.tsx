import Link from "next/link";
import type { NavigationMenuItem } from "@/lib/navigation/navigation.types";

function isExternal(item: NavigationMenuItem) {
  return item.type === "external" || item.type === "mailto" || item.type === "tel";
}

export function PublicFooterLink({ item }: { item: NavigationMenuItem }) {
  if (item.type === "none") return <span>{item.label}</span>;
  if (isExternal(item)) {
    return (
      <a href={item.href} target={item.type === "external" ? "_blank" : item.target} rel={item.type === "external" ? "noopener noreferrer" : undefined}>
        {item.label}
      </a>
    );
  }
  return <Link href={item.href || "/"}>{item.label}</Link>;
}

export function PublicFooterMenu({ title, items }: { title: string; items: NavigationMenuItem[] }) {
  const visible = items.filter((item) => item.isEnabled !== false);
  if (!visible.length) return null;
  return (
    <div className="aera-public-footer__column">
      <h3>{title}</h3>
      <ul>
        {visible.map((item) => (
          <li key={item.id}>
            <PublicFooterLink item={item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
