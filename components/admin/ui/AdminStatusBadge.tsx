"use client";

import React from "react";

/* ─── Semantic color palettes mapped to admin design tokens ────────────── */

type ColorPalette = {
  dot: string;
  bg: string;
  text: string;
};

const palette = {
  success: {
    dot: "var(--admin-success)",
    bg: "var(--admin-success-soft)",
    text: "var(--admin-success)",
  },
  warning: {
    dot: "var(--admin-warning)",
    bg: "var(--admin-warning-soft)",
    text: "var(--admin-warning)",
  },
  danger: {
    dot: "var(--admin-danger)",
    bg: "var(--admin-danger-soft)",
    text: "var(--admin-danger)",
  },
  neutral: {
    dot: "var(--admin-neutral)",
    bg: "var(--admin-neutral-soft)",
    text: "var(--admin-neutral)",
  },
  accent: {
    dot: "var(--admin-accent)",
    bg: "var(--admin-accent-soft)",
    text: "var(--admin-accent)",
  },
  info: {
    dot: "var(--admin-info)",
    bg: "var(--admin-info-soft)",
    text: "var(--admin-info)",
  },
  muted: {
    dot: "var(--admin-muted)",
    bg: "var(--admin-surface-muted)",
    text: "var(--admin-muted)",
  },
} as const satisfies Record<string, ColorPalette>;

/* ─── Status configuration ─────────────────────────────────────────────── */

type StatusConfig = { label: string; colors: ColorPalette };

const STATUS_MAP: Record<string, StatusConfig> = {
  /* Content statuses */
  published:      { label: "Published",          colors: palette.success },
  draft:          { label: "Draft",              colors: palette.warning },
  scheduled:      { label: "Scheduled",          colors: palette.info },
  archived:       { label: "Archived",           colors: palette.muted },
  "not-configured": { label: "Not Configured",   colors: palette.danger },

  /* Booking statuses */
  confirmed:      { label: "Confirmed",          colors: palette.success },
  pending:        { label: "Pending",            colors: palette.warning },
  cancelled:      { label: "Cancelled",          colors: palette.danger },
  completed:      { label: "Completed",          colors: palette.neutral },
  "checked-in":   { label: "Checked In",         colors: palette.info },
  "in-service":   { label: "In Service",         colors: palette.accent },
  "no-show":      { label: "No Show",            colors: palette.danger },

  /* Gift card statuses */
  issued:              { label: "Issued",              colors: palette.success },
  "pending-payment":   { label: "Pending Payment",     colors: palette.warning },
  "partially-redeemed": { label: "Partially Redeemed", colors: palette.accent },
  redeemed:            { label: "Redeemed",            colors: palette.neutral },
  refunded:            { label: "Refunded",            colors: palette.danger },
  expired:             { label: "Expired",             colors: palette.muted },

  /* Inventory statuses */
  healthy:        { label: "Healthy",            colors: palette.success },
  "low-stock":    { label: "Low Stock",          colors: palette.warning },
  "out-of-stock": { label: "Out of Stock",       colors: palette.danger },

  /* Generic statuses */
  active:         { label: "Active",             colors: palette.success },
  inactive:       { label: "Inactive",           colors: palette.muted },
};

/* ─── Exported types ───────────────────────────────────────────────────── */

/** All known status keys. The component also accepts any arbitrary string. */
export type AdminStatusType = keyof typeof STATUS_MAP;

export interface AdminStatusBadgeProps {
  /** Status key — known keys get a curated label + color; unknown strings
   *  are title-cased and rendered with a neutral palette. */
  status: AdminStatusType | (string & {});
  /** Optional override for the display label. */
  label?: string;
  /** Additional CSS class names applied to the root element. */
  className?: string;
}

/* ─── Helpers ──────────────────────────────────────────────────────────── */

/** Turn "some-status" → "Some Status" for unknown status strings. */
function humanize(value: string): string {
  return value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function resolveConfig(status: string): StatusConfig {
  const key = status.toLowerCase().trim();
  return STATUS_MAP[key] ?? { label: humanize(status), colors: palette.neutral };
}

/* ─── Component ────────────────────────────────────────────────────────── */

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({
  status,
  label,
  className,
}) => {
  const config = resolveConfig(status);
  const displayLabel = label ?? config.label;
  const { colors } = config;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        "text-[10px] font-bold uppercase tracking-wider leading-none",
        "whitespace-nowrap select-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{ backgroundColor: colors.dot }}
        aria-hidden="true"
      />
      {displayLabel}
    </span>
  );
};

export default AdminStatusBadge;
