/* ── Dashboard Formatters & Constants ──────────────────────── */

/**
 * Format a number as US-style currency (or any ISO 4217 code).
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format an ISO date string to a readable date like "July 3, 2026".
 */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format an ISO date string to time like "2:30 PM".
 */
export function formatTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format an ISO date string to a short date like "Jul 3".
 */
export function formatShortDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Status badge text-color map (hex).
 */
export const STATUS_COLORS: Record<string, string> = {
  Pending: '#e6a023',
  Confirmed: '#3f9142',
  'Checked In': '#5b7b9a',
  'In Service': '#a85d1e',
  Completed: '#7f6d61',
  Cancelled: '#c53030',
  'No Show': '#9b2c2c',
};

/**
 * Status badge background-color map (lighter tints).
 */
export const STATUS_BG_COLORS: Record<string, string> = {
  Pending: 'rgba(230, 160, 35, 0.12)',
  Confirmed: 'rgba(63, 145, 66, 0.12)',
  'Checked In': 'rgba(91, 123, 154, 0.12)',
  'In Service': 'rgba(168, 93, 30, 0.12)',
  Completed: 'rgba(127, 109, 97, 0.12)',
  Cancelled: 'rgba(197, 48, 48, 0.10)',
  'No Show': 'rgba(155, 44, 44, 0.10)',
};
