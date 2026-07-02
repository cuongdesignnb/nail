"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  FolderOpen,
  Gem,
  Globe,
  Home,
  Image as ImageIcon,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  Star,
  Tags,
  Users,
  Wrench,
  X,
  BarChart3,
} from "lucide-react";

/* ────────────────────────────── Navigation Config ────────────────────────────── */
type NavItem = { label: string; href: string; icon: React.ElementType };
type NavGroup = { title: string; items: NavItem[] };

const navGroups: NavGroup[] = [
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
      { label: "Technicians", href: "/admin/technicians", icon: Users },
      { label: "Inventory", href: "/admin/inventory", icon: Inbox },
    ],
  },
  {
    title: "Catalog",
    items: [
      { label: "Services", href: "/admin/services", icon: Gem },
      { label: "Packages", href: "/admin/packages", icon: Package },
      { label: "Promotions", href: "/admin/promotions", icon: Tags },
    ],
  },
  {
    title: "Website",
    items: [
      { label: "Content Hub", href: "/admin/content", icon: FolderOpen },
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

const SIDEBAR_KEY = "aera_sidebar_collapsed";

/* ────────────────────────────── Sidebar Component ────────────────────────────── */
function Sidebar({
  collapsed,
  onToggle,
  pathname,
}: {
  collapsed: boolean;
  onToggle: () => void;
  pathname: string;
}) {
  return (
    <aside
      className={`admin-sidebar-new ${collapsed ? "admin-sidebar-collapsed" : ""}`}
    >
      {/* Logo */}
      <div className="admin-sidebar-logo">
        <Link href="/admin" className="admin-sidebar-logo-link">
          <Image src="/aera-mark.svg" alt="Aera" width={36} height={36} />
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="admin-sidebar-brand"
            >
              Aera Nail Lounge
            </motion.span>
          )}
        </Link>
        <button
          onClick={onToggle}
          className="admin-sidebar-toggle"
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="admin-sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.title} className="admin-sidebar-group">
            {!collapsed && (
              <span className="admin-sidebar-group-title">{group.title}</span>
            )}
            {collapsed && <div className="admin-sidebar-divider" />}
            {group.items.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-sidebar-item ${isActive ? "active" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} strokeWidth={1.8} />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="admin-sidebar-footer">
        {!collapsed && (
          <div className="admin-sidebar-promo">
            <Wrench size={16} />
            <div>
              <b>Salon Pro Plan</b>
              <p>Full CMS & analytics access</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

/* ────────────────────────────── Mobile Drawer ────────────────────────────── */
function MobileDrawer({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="admin-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="admin-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="admin-drawer-header">
              <Link href="/admin" className="admin-sidebar-logo-link" onClick={onClose}>
                <Image src="/aera-mark.svg" alt="Aera" width={32} height={32} />
                <span className="admin-sidebar-brand">Aera Nail Lounge</span>
              </Link>
              <button onClick={onClose} className="admin-drawer-close">
                <X size={20} />
              </button>
            </div>
            <nav className="admin-sidebar-nav">
              {navGroups.map((group) => (
                <div key={group.title} className="admin-sidebar-group">
                  <span className="admin-sidebar-group-title">{group.title}</span>
                  {group.items.map((item) => {
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`admin-sidebar-item ${isActive ? "active" : ""}`}
                        onClick={onClose}
                      >
                        <item.icon size={18} strokeWidth={1.8} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

/* ────────────────────────────── Topbar Component ────────────────────────────── */
function Topbar({
  onMenuOpen,
  collapsed,
}: {
  onMenuOpen: () => void;
  collapsed: boolean;
}) {
  return (
    <header className="admin-topbar-new">
      <div className="admin-topbar-left">
        <button onClick={onMenuOpen} className="admin-mobile-menu-btn">
          <Menu size={20} />
        </button>
      </div>

      <div className="admin-topbar-right">
        <button className="admin-topbar-icon-btn" title="Search">
          <Search size={18} />
        </button>

        <button className="admin-topbar-icon-btn admin-topbar-notif" title="Notifications">
          <Bell size={18} />
          <span className="admin-topbar-badge">3</span>
        </button>

        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-topbar-view-site"
          title="View Website"
        >
          <ExternalLink size={15} />
          <span>View Site</span>
        </Link>

        <div className="admin-topbar-profile">
          <div className="admin-topbar-avatar">S</div>
          <div className="admin-topbar-profile-info">
            <span className="admin-topbar-profile-name">Sophia</span>
            <span className="admin-topbar-profile-role">Owner</span>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ────────────────────────────── Main Layout ────────────────────────────── */
export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  function toggleCollapse() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_KEY, String(next));
      return next;
    });
  }

  return (
    <div className={`admin-layout-root ${collapsed ? "sidebar-collapsed" : ""}`}>
      <Sidebar
        collapsed={collapsed}
        onToggle={toggleCollapse}
        pathname={pathname}
      />
      <MobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
      />
      <div className="admin-content-area">
        <Topbar
          onMenuOpen={() => setDrawerOpen(true)}
          collapsed={collapsed}
        />
        <main className="admin-main-content">{children}</main>
      </div>
    </div>
  );
}
