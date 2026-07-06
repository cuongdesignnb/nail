"use client";

import { useEffect, useMemo, useState } from "react";
import { Download, RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";

export type GiftCardFilterState = {
  query: string;
  type: "ALL" | "AMOUNT" | "SERVICE";
  status: "ALL" | "PENDING_PAYMENT" | "PAID" | "ISSUED" | "PARTIALLY_REDEEMED" | "REDEEMED" | "EXPIRED" | "CANCELLED" | "REFUNDED";
  emailStatus: "ALL" | "PENDING" | "SENT" | "FAILED";
  from?: string;
  to?: string;
};

type GiftCardFiltersProps = {
  value: GiftCardFilterState;
  onChange: (next: GiftCardFilterState) => void;
  onClear: () => void;
  onExport: () => void;
  isLoading?: boolean;
};

const selectClass =
  "h-10 rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-[var(--admin-surface)] px-3 text-[13px] font-medium text-[var(--admin-ink)] outline-none transition focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/15";

export const emptyGiftCardFilters: GiftCardFilterState = {
  query: "",
  type: "ALL",
  status: "ALL",
  emailStatus: "ALL",
  from: "",
  to: "",
};

function activeFilterCount(value: GiftCardFilterState) {
  return [
    value.query.trim(),
    value.type !== "ALL",
    value.status !== "ALL",
    value.emailStatus !== "ALL",
    value.from,
    value.to,
  ].filter(Boolean).length;
}

function FilterFields({
  value,
  update,
}: {
  value: GiftCardFilterState;
  update: (patch: Partial<GiftCardFilterState>) => void;
}) {
  return (
    <>
      <select className={`${selectClass} w-full sm:w-[150px]`} value={value.type} onChange={(event) => update({ type: event.target.value as GiftCardFilterState["type"] })}>
        <option value="ALL">All Types</option>
        <option value="AMOUNT">Amount</option>
        <option value="SERVICE">Service</option>
      </select>
      <select className={`${selectClass} w-full sm:w-[170px]`} value={value.status} onChange={(event) => update({ status: event.target.value as GiftCardFilterState["status"] })}>
        <option value="ALL">All Statuses</option>
        <option value="ISSUED">Issued</option>
        <option value="PARTIALLY_REDEEMED">Partially Redeemed</option>
        <option value="REDEEMED">Redeemed</option>
        <option value="CANCELLED">Cancelled</option>
        <option value="REFUNDED">Refunded</option>
        <option value="EXPIRED">Expired</option>
      </select>
      <select className={`${selectClass} w-full sm:w-[160px]`} value={value.emailStatus} onChange={(event) => update({ emailStatus: event.target.value as GiftCardFilterState["emailStatus"] })}>
        <option value="ALL">All Email</option>
        <option value="SENT">Sent</option>
        <option value="PENDING">Pending</option>
        <option value="FAILED">Failed</option>
      </select>
      <div className="grid w-full grid-cols-2 gap-2 sm:w-[230px]">
        <input className={selectClass} type="date" value={value.from || ""} onChange={(event) => update({ from: event.target.value })} aria-label="From date" />
        <input className={selectClass} type="date" value={value.to || ""} onChange={(event) => update({ to: event.target.value })} aria-label="To date" />
      </div>
    </>
  );
}

export default function GiftCardFilters({ value, onChange, onClear, onExport, isLoading }: GiftCardFiltersProps) {
  const [draftQuery, setDraftQuery] = useState(value.query);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const count = useMemo(() => activeFilterCount(value), [value]);

  useEffect(() => {
    setDraftQuery(value.query);
  }, [value.query]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (draftQuery !== value.query) onChange({ ...value, query: draftQuery });
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [draftQuery, onChange, value]);

  const update = (patch: Partial<GiftCardFilterState>) => onChange({ ...value, ...patch });

  return (
    <section className="mb-4 rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] p-3 shadow-[var(--admin-shadow-sm)]">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1 md:max-w-[360px]">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-muted)]" />
          <input
            value={draftQuery}
            onChange={(event) => setDraftQuery(event.target.value)}
            placeholder="Search recipient, purchaser, or code..."
            className="h-10 w-full rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-[var(--admin-surface)] pl-9 pr-3 text-[13px] text-[var(--admin-ink)] outline-none transition placeholder:text-[var(--admin-placeholder)] focus:border-[var(--admin-accent)] focus:ring-2 focus:ring-[var(--admin-accent)]/15"
          />
        </div>

        <div className="hidden flex-wrap items-center gap-3 md:flex">
          <FilterFields value={value} update={update} />
        </div>

        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="inline-flex h-10 items-center gap-2 rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-white px-3 text-[13px] font-semibold text-[var(--admin-ink)] transition hover:bg-[var(--admin-surface-hover)] md:hidden"
        >
          <SlidersHorizontal size={15} />
          Filters
          {count > 0 && <span className="rounded-full bg-[var(--admin-accent)] px-1.5 py-0.5 text-[10px] text-white">{count}</span>}
        </button>

        <div className="ml-auto flex items-center gap-2">
          {count > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex h-10 items-center gap-1.5 rounded-[var(--admin-radius-md)] px-3 text-[12px] font-semibold text-[var(--admin-muted)] transition hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-ink)]"
            >
              <RotateCcw size={13} />
              Clear filters
            </button>
          )}
          <button
            type="button"
            onClick={onExport}
            disabled={isLoading}
            className="inline-flex h-10 items-center gap-2 rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] bg-white px-3 text-[13px] font-semibold text-[var(--admin-ink)] transition hover:bg-[var(--admin-surface-hover)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button className="absolute inset-0 bg-black/35" type="button" aria-label="Close filters" onClick={() => setDrawerOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl border border-[var(--admin-border)] bg-white p-4 shadow-[var(--admin-shadow-xl)]">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[var(--admin-ink)]">Filters</h2>
                <p className="text-xs text-[var(--admin-muted)]">{count} active</p>
              </div>
              <button type="button" onClick={() => setDrawerOpen(false)} className="rounded-full p-2 text-[var(--admin-muted)] hover:bg-[var(--admin-surface-hover)]">
                <X size={18} />
              </button>
            </div>
            <div className="grid gap-3">
              <FilterFields value={value} update={update} />
            </div>
            <div className="mt-4 flex gap-2">
              <button type="button" onClick={onClear} className="h-10 flex-1 rounded-[var(--admin-radius-md)] border border-[var(--admin-border)] text-sm font-semibold">
                Clear
              </button>
              <button type="button" onClick={() => setDrawerOpen(false)} className="h-10 flex-1 rounded-[var(--admin-radius-md)] bg-[var(--admin-accent)] text-sm font-semibold text-white">
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
