"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import {
  LayoutDashboard,
  ClipboardList,
  CalendarDays,
  Users,
  UserCog,
  Inbox,
  Gem,
  Package,
  Tags,
  FolderOpen,
  Image as ImageIcon,
  Globe,
  FileText,
  Star,
  BarChart3,
  Settings,
} from "lucide-react";

/* ────────────────────────────── Search Items ────────────────────────────── */
interface SearchItem {
  label: string;
  href: string;
  icon: React.ElementType;
  keywords: string[];
}

const searchItems: SearchItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, keywords: ["home", "overview", "dashboard"] },
  { label: "Bookings", href: "/admin/bookings", icon: ClipboardList, keywords: ["booking", "appointment", "schedule"] },
  { label: "Calendar", href: "/admin/calendar", icon: CalendarDays, keywords: ["calendar", "date", "schedule"] },
  { label: "Customers", href: "/admin/customers", icon: Users, keywords: ["customer", "client", "user"] },
  { label: "Technicians", href: "/admin/technicians", icon: UserCog, keywords: ["technician", "staff", "employee", "nail tech"] },
  { label: "Inventory", href: "/admin/inventory", icon: Inbox, keywords: ["inventory", "stock", "supply"] },
  { label: "Services", href: "/admin/services", icon: Gem, keywords: ["service", "treatment", "manicure", "pedicure"] },
  { label: "Packages", href: "/admin/packages", icon: Package, keywords: ["package", "bundle", "combo"] },
  { label: "Promotions", href: "/admin/promotions", icon: Tags, keywords: ["promotion", "discount", "sale", "deal"] },
  { label: "Content Hub", href: "/admin/content", icon: FolderOpen, keywords: ["content", "page", "cms", "hub"] },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon, keywords: ["media", "image", "photo", "upload"] },
  { label: "SEO Manager", href: "/admin/seo", icon: Globe, keywords: ["seo", "search", "meta", "google"] },
  { label: "Blog", href: "/admin/blog", icon: FileText, keywords: ["blog", "post", "article"] },
  { label: "Reviews", href: "/admin/reviews", icon: Star, keywords: ["review", "rating", "feedback"] },
  { label: "Reports", href: "/admin/reports", icon: BarChart3, keywords: ["report", "analytics", "stats"] },
  { label: "Settings", href: "/admin/settings", icon: Settings, keywords: ["setting", "config", "preference"] },
];

/* ────────────────────────────── Props ────────────────────────────── */
interface AdminGlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

/* ────────────────────────────── Component ────────────────────────────── */
export default function AdminGlobalSearch({
  open,
  onClose,
}: AdminGlobalSearchProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  /* Filter items based on search query */
  const filtered = query.trim()
    ? searchItems.filter((item) => {
        const q = query.toLowerCase();
        return (
          item.label.toLowerCase().includes(q) ||
          item.keywords.some((k) => k.includes(q))
        );
      })
    : searchItems;

  /* Reset on open/close */
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      /* Focus the input after animation starts */
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  /* Reset active index when filtered list changes */
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  /* Navigate to selected item */
  const navigateTo = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router]
  );

  /* Keyboard handling */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev < filtered.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : filtered.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (filtered[activeIndex]) {
            navigateTo(filtered[activeIndex].href);
          }
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
      }
    },
    [filtered, activeIndex, navigateTo, onClose]
  );

  /* Scroll active item into view */
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.children[activeIndex] as HTMLElement;
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  /* Global ⌘K / Ctrl+K listener */
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) {
          onClose();
        }
        /* Opening is handled by the parent via onSearchOpen */
      }
    }
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="admin-command-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Global search"
        >
          <motion.div
            className="admin-command"
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2 }}
            onKeyDown={handleKeyDown}
          >
            {/* Search Input */}
            <div className="admin-command__input-wrap">
              <Search
                size={18}
                className="text-[var(--admin-muted)] flex-shrink-0"
                aria-hidden="true"
              />
              <input
                ref={inputRef}
                type="text"
                className="admin-command__input"
                placeholder="Search pages…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search pages"
                autoComplete="off"
              />
              <kbd className="text-[11px] font-sans px-1.5 py-0.5 rounded border border-[var(--admin-border)] bg-[var(--admin-surface-muted)] text-[var(--admin-muted)]">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <ul ref={listRef} className="admin-command__list" role="listbox">
              {filtered.length === 0 && (
                <li className="px-4 py-8 text-center text-[13px] text-[var(--admin-muted)]">
                  No results found
                </li>
              )}
              {filtered.map((item, index) => {
                const isActive = index === activeIndex;
                return (
                  <li
                    key={item.href}
                    role="option"
                    aria-selected={isActive}
                    className={[
                      "admin-command__list-item",
                      isActive ? "admin-command__list-item--active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => navigateTo(item.href)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    <item.icon size={16} strokeWidth={1.8} />
                    <span>{item.label}</span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
