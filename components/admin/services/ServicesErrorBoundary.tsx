"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

type ServicesErrorBoundaryProps = {
  children: React.ReactNode;
};

type ServicesErrorBoundaryState = {
  error: Error | null;
};

export class ServicesErrorBoundary extends React.Component<
  ServicesErrorBoundaryProps,
  ServicesErrorBoundaryState
> {
  state: ServicesErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Services admin crashed:", error);
    }
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="rounded-3xl border border-rose-200 bg-rose-50/80 p-8 text-center shadow-luxury">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-rose-500 shadow-sm">
          <AlertTriangle size={22} />
        </div>
        <h2 className="font-heading text-xl font-bold text-[var(--admin-ink)]">
          Something went wrong while loading Services.
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-xs leading-6 text-[var(--admin-muted)]">
          The services manager hit an unexpected error. Try again, or reload the page if the issue persists.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--admin-border)] bg-white px-5 py-2 text-xs font-bold text-[var(--admin-ink)] transition hover:bg-[var(--admin-surface-hover)]"
          >
            <RefreshCw size={13} />
            Try Again
          </button>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold text-white transition hover:bg-[var(--admin-accent-hover)]"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }
}
