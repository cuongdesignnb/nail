"use client";

import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import AdminSidebarNav from "./AdminSidebarNav";
import AdminSidebarFooter from "./AdminSidebarFooter";
import type { NavGroup } from "./AdminSidebarNav";

/* ────────────────────────────── Nav Config ────────────────────────────── */
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Users,
  UserCog,
  Inbox,
  Gem,
  Package,
  Gift,
  Tags,
  FolderOpen,
  Image as ImageIcon,
  Globe,
  FileText,
  Star,
  BarChart3,
  Settings,
  Menu,
} from "lucide-react";

export const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Bookings", href: "/admin/bookings", icon: ClipboardList },
      { label: "Calendar", href: "/admin/calendar", icon: CalendarDays },
      { label: "Customers", href: "/admin/customers", icon: Users },
      { label: "Technicians", href: "/admin/technicians", icon: UserCog },
      { label: "Inventory", href: "/admin/inventory", icon: Inbox },
    ],
  },
  {
    title: "Catalog",
    items: [
      { label: "Services", href: "/admin/services", icon: Gem },
      { label: "Packages", href: "/admin/packages", icon: Package },
      { label: "Gift Cards", href: "/admin/gift-cards", icon: Gift },
      { label: "Promotions", href: "/admin/promotions", icon: Tags },
    ],
  },
  {
    title: "Website",
    items: [
      { label: "Content Hub", href: "/admin/content", icon: FolderOpen },
      { label: "Menus", href: "/admin/menus", icon: Menu },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      { label: "SEO Manager", href: "/admin/seo", icon: Globe },
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
      { label: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
];

/* ────────────────────────────── Props ────────────────────────────── */
interface AdminSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  pathname: string;
}

/* ────────────────────────────── Component ────────────────────────────── */
export default function AdminSidebar({
  collapsed,
  onToggle,
  pathname,
}: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      {/* ── Logo Area ─────────────────────────────────────────── */}
      <div className="admin-sidebar__logo">
        <Link href="/admin" className="admin-sidebar__logo-link">
          <Image
            src="/aera-mark.svg"
            alt="Aera"
            width={36}
            height={36}
            priority
          />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.16 }}
              className="admin-sidebar__brand"
            >
              Aera Nail Lounge
            </motion.span>
          )}
        </Link>

        <button
          onClick={onToggle}
          className="admin-sidebar__toggle admin-focus-ring"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight size={16} />
          ) : (
            <ChevronLeft size={16} />
          )}
        </button>
      </div>

      {/* ── Navigation ────────────────────────────────────────── */}
      <AdminSidebarNav
        groups={navGroups}
        pathname={pathname}
        collapsed={collapsed}
      />

      {/* ── Footer ────────────────────────────────────────────── */}
      <AdminSidebarFooter collapsed={collapsed} />
    </aside>
  );
}
