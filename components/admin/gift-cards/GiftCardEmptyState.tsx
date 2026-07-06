"use client";

import { Gift } from "lucide-react";

export default function GiftCardEmptyState({ onIssue }: { onIssue: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]">
        <Gift size={20} />
      </div>
      <h3 className="text-sm font-bold text-[var(--admin-ink)]">No Gift Cards Yet</h3>
      <p className="mt-1 max-w-sm text-sm text-[var(--admin-muted)]">Gift cards will appear here once purchased or issued.</p>
      <button
        type="button"
        onClick={onIssue}
        className="mt-4 rounded-[var(--admin-radius-md)] bg-[var(--admin-accent)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--admin-accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/30"
      >
        Issue a Gift Card
      </button>
    </div>
  );
}
