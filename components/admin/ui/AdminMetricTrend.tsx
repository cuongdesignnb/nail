"use client";

import React from "react";
import clsx from "clsx";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";

export type MetricTrendDirection = "up" | "down" | "neutral" | "new";

export interface AdminMetricTrendProps {
  trend: MetricTrendDirection;
  label: string;
  className?: string;
}

const trendConfig: Record<
  MetricTrendDirection,
  { icon: React.ElementType; colorClass: string }
> = {
  up: {
    icon: TrendingUp,
    colorClass: "text-[var(--admin-success)]",
  },
  down: {
    icon: TrendingDown,
    colorClass: "text-[var(--admin-danger)]",
  },
  neutral: {
    icon: Minus,
    colorClass: "text-[var(--admin-muted)]",
  },
  new: {
    icon: Sparkles,
    colorClass: "text-[var(--admin-info)]",
  },
};

export const AdminMetricTrend: React.FC<AdminMetricTrendProps> = ({
  trend,
  label,
  className,
}) => {
  const config = trendConfig[trend];
  const TrendIcon = config.icon;

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 text-[12px] font-medium",
        config.colorClass,
        className
      )}
    >
      <TrendIcon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
};

export default AdminMetricTrend;
