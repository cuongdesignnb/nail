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
  Gem,
  Package,
  Inbox,
  Gift,
  Tags,
  Star,
  BarChart3,
  Settings,
  FolderOpen,
  FileText,
  Image as ImageIcon,
  Globe,
  Menu,
  Mail,
  ShieldCheck,
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
    ],
  },
  {
    title: "Catalog",
    items: [
      { label: "Services", href: "/admin/services", icon: Gem },
      { label: "Packages", href: "/admin/packages", icon: Package },
      { label: "Inventory", href: "/admin/inventory", icon: Inbox },
    ],
  },
  {
    title: "Commerce",
    items: [
      { label: "Gift Cards", href: "/admin/gift-cards", icon: Gift },
      { label: "Promotions", href: "/admin/promotions", icon: Tags },
    ],
  },
  {
    title: "Reputation",
    items: [
      { label: "Reviews", href: "/admin/reviews", icon: Star },
    ],
  },
  {
    title: "Analytics",
    items: [
      { label: "Reports", href: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Website",
    items: [
      { label: "Content Hub", href: "/admin/content", icon: FolderOpen },
      { label: "Blog", href: "/admin/blog", icon: FileText },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
      { label: "Menus", href: "/admin/menus", icon: Menu },
      { label: "SEO Manager", href: "/admin/seo", icon: Globe },
    ],
  },
  {
    title: "System",
    items: [
      { label: "Settings", href: "/admin/settings", icon: Settings },
      { label: "Email & SMTP", href: "/admin/settings/email", icon: Mail },
      { label: "Users", href: "/admin/users", icon: ShieldCheck },
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
