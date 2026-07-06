"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

/* ────────────────────────────── Segment Labels ────────────────────────────── */
const segmentLabels: Record<string, string> = {
  admin: "Admin",
  bookings: "Bookings",
  calendar: "Calendar",
  customers: "Customers",
  technicians: "Technicians",
  inventory: "Inventory",
  services: "Services",
  packages: "Packages",
  promotions: "Promotions",
  content: "Content Hub",
  media: "Media Library",
  seo: "SEO Manager",
  blog: "Blog",
  reviews: "Reviews",
  reports: "Reports",
  settings: "Settings",
  posts: "Posts",
  new: "New",
  edit: "Edit",
};

/* ────────────────────────────── Props ────────────────────────────── */
interface AdminBreadcrumbsProps {
  pathname: string;
}

/* ────────────────────────────── Component ────────────────────────────── */
export default function AdminBreadcrumbs({ pathname }: AdminBreadcrumbsProps) {
  const segments = pathname.split("/").filter(Boolean);

  /* Don't render breadcrumbs on the root admin page */
  if (segments.length <= 1) return null;

  /* Build breadcrumb items from segments */
  const crumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label =
      segmentLabels[segment] ||
      segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    const isLast = index === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav className="admin-breadcrumbs" aria-label="Breadcrumbs">
      {crumbs.map((crumb, index) => (
        <span key={crumb.href} className="flex items-center gap-1.5">
          {/* Separator between items */}
          {index > 0 && (
            <ChevronRight
              size={12}
              className="admin-breadcrumbs__separator"
              aria-hidden="true"
            />
          )}

          {crumb.isLast ? (
            <span className="admin-breadcrumbs__current">{crumb.label}</span>
          ) : (
            <Link href={crumb.href}>{crumb.label}</Link>
          )}
        </span>
      ))}
    </nav>
  );
}
