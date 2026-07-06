"use client";

import React from "react";
import clsx from "clsx";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AdminSkeleton } from "./AdminSkeleton";

export type KpiTrend = "up" | "down" | "neutral";

export interface AdminKpiCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string | number;
  changeLabel?: string;
  trend?: KpiTrend;
  /** When true, renders skeleton placeholders instead of content. */
  loading?: boolean;
  /** Optional helper text rendered below the label. */
  supportingText?: string;
  className?: string;
}

const trendConfig: Record<
  KpiTrend,
  { icon: React.ElementType; colorClass: string; bgClass: string }
> = {
  up: {
    icon: TrendingUp,
    colorClass: "text-[var(--admin-success)]",
    bgClass: "bg-[var(--admin-success-soft)]",
  },
  down: {
    icon: TrendingDown,
    colorClass: "text-[var(--admin-danger)]",
    bgClass: "bg-[var(--admin-danger-soft)]",
  },
  neutral: {
    icon: Minus,
    colorClass: "text-[var(--admin-muted)]",
    bgClass: "bg-[var(--admin-neutral-soft)]",
  },
};

export const AdminKpiCard: React.FC<AdminKpiCardProps> = ({
  icon,
  label,
  value,
  change,
  changeLabel,
  trend = "neutral",
  loading = false,
  supportingText,
  className,
}) => {
  const trendInfo = trendConfig[trend];
  const TrendIcon = trendInfo.icon;

  return (
    <div
      className={clsx(
        "bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-[var(--admin-radius-lg)]",
        "shadow-[var(--admin-shadow-sm)] p-5",
        "transition-all duration-[var(--admin-transition-normal)]",
        "hover:shadow-[var(--admin-shadow-md)] hover:border-[var(--admin-border-strong)]",
        "min-h-[132px]",
        className
      )}
    >
      {loading ? (
        /* -------- Skeleton state -------- */
        <div className="flex flex-col gap-3">
          {/* Icon placeholder */}
          <AdminSkeleton variant="rect" width="40px" height="40px" className="rounded-[var(--admin-radius-md)]" />
          {/* Value placeholder */}
          <AdminSkeleton variant="line" width="55%" height="24px" />
          {/* Label placeholder */}
          <AdminSkeleton variant="line" width="40%" height="12px" />
          {/* Trend placeholder */}
          <AdminSkeleton variant="line" width="30%" height="16px" />
        </div>
      ) : (
        <>
          {/* Icon */}
          <div
            className={clsx(
              "flex h-10 w-10 items-center justify-center",
              "rounded-[var(--admin-radius-md)] bg-[var(--admin-accent-soft)]",
              "text-[var(--admin-accent)]",
              "[&>svg]:h-5 [&>svg]:w-5"
            )}
            aria-hidden="true"
          >
            {icon}
          </div>

          {/* Value — uses font-sans (Inter) per spec */}
          <p className="mt-4 text-2xl font-bold text-[var(--admin-ink)] font-sans">
            {value}
          </p>

          {/* Label */}
          <p className="mt-1 text-xs font-medium text-[var(--admin-muted)] uppercase tracking-wider">
            {label}
          </p>

          {/* Supporting text */}
          {supportingText && (
            <p className="mt-0.5 text-[11px] text-[var(--admin-ink-secondary)]">
              {supportingText}
            </p>
          )}

          {/* Trend */}
          {change !== undefined && (
            <div className="mt-3 flex items-center gap-1.5">
              <span
                className={clsx(
                  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  trendInfo.bgClass,
                  trendInfo.colorClass
                )}
              >
                <TrendIcon className="h-3 w-3" />
                {change}
              </span>
              {changeLabel && (
                <span className="text-[11px] text-[var(--admin-muted)]">
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminKpiCard;
