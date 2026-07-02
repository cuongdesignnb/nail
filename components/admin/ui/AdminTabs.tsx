"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import clsx from "clsx";

export interface TabItem {
  key: string;
  label: string;
  icon?: LucideIcon;
}

export interface AdminTabsProps {
  tabs: TabItem[];
  activeKey: string;
  onChange: (key: string) => void;
  children?: React.ReactNode;
}

export const AdminTabs: React.FC<AdminTabsProps> = ({
  tabs,
  activeKey,
  onChange,
  children,
}) => {
  return (
    <div>
      {/* Tab List */}
      <div
        className="flex items-center gap-1 border-b border-aera-champagne/30 overflow-x-auto scrollbar-none"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          const IconComp = tab.icon;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(tab.key)}
              className={clsx(
                "relative flex items-center gap-1.5 whitespace-nowrap px-4 py-2.5 text-xs font-semibold transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40 focus-visible:ring-inset rounded-t-lg",
                isActive
                  ? "text-aera-accent"
                  : "text-aera-muted hover:text-aera-ink"
              )}
            >
              {IconComp && (
                <IconComp className="h-3.5 w-3.5 shrink-0" />
              )}
              {tab.label}

              {/* Active underline */}
              {isActive && (
                <motion.div
                  layoutId="admin-tab-underline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-aera-accent rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      {children && <div className="pt-5">{children}</div>}
    </div>
  );
};

export default AdminTabs;
