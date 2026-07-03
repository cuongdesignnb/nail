// ---------------------------------------------------------------------------
// Dashboard mapper / formatting helpers
// ---------------------------------------------------------------------------

import type { DashboardKpi } from './dashboard.types';

// ---------------------------------------------------------------------------
// Currency
// ---------------------------------------------------------------------------

export function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// ---------------------------------------------------------------------------
// Percentage
// ---------------------------------------------------------------------------

export function formatPercentage(value: number): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

// ---------------------------------------------------------------------------
// KPI delta calculation
// ---------------------------------------------------------------------------

export function computeKpiDelta(
  current: number,
  previous: number,
): {
  change: number | null;
  changeLabel: string;
  trend: 'up' | 'down' | 'neutral' | 'new';
} {
  // No previous data but something current → "New"
  if (previous === 0 && current > 0) {
    return { change: null, changeLabel: 'New', trend: 'new' };
  }

  // Both zero → "No change"
  if (previous === 0 && current === 0) {
    return { change: null, changeLabel: 'No change', trend: 'neutral' };
  }

  const change = ((current - previous) / previous) * 100;
  const rounded = Math.round(change * 10) / 10;

  if (rounded === 0) {
    return { change: 0, changeLabel: 'No change', trend: 'neutral' };
  }

  return {
    change: rounded,
    changeLabel: formatPercentage(rounded),
    trend: rounded > 0 ? 'up' : 'down',
  };
}

// ---------------------------------------------------------------------------
// KPI builder
// ---------------------------------------------------------------------------

export function buildKpi(
  label: string,
  current: number,
  previous: number,
  formatter: (v: number) => string,
): DashboardKpi {
  const { change, changeLabel, trend } = computeKpiDelta(current, previous);
  return {
    label,
    value: current,
    previousValue: previous,
    formattedValue: formatter(current),
    change,
    changeLabel,
    trend,
  };
}
