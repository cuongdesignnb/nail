"use client";

function SkeletonCard() {
  return (
    <div className="bg-white/90 border border-aera-champagne/30 rounded-2xl p-5 animate-pulse">
      {/* Icon + badge row */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-aera-champagne/60" />
        <div className="w-20 h-5 rounded-full bg-aera-champagne/40" />
      </div>

      {/* Title */}
      <div className="h-4 w-3/4 rounded bg-aera-champagne/60 mb-2" />

      {/* Description */}
      <div className="h-3 w-full rounded bg-aera-champagne/30 mb-1.5" />
      <div className="h-3 w-2/3 rounded bg-aera-champagne/30 mb-4" />

      {/* URL line */}
      <div className="h-3 w-1/2 rounded bg-aera-champagne/20 mb-4" />

      {/* Timestamps */}
      <div className="flex gap-4 mb-4">
        <div className="h-3 w-24 rounded bg-aera-champagne/20" />
        <div className="h-3 w-24 rounded bg-aera-champagne/20" />
      </div>

      {/* Action buttons */}
      <div className="pt-3 border-t border-aera-champagne/30 flex gap-2">
        <div className="h-7 w-24 rounded-lg bg-aera-champagne/40" />
        <div className="h-7 w-16 rounded-lg bg-aera-champagne/30" />
        <div className="h-7 w-12 rounded-lg bg-aera-champagne/30" />
      </div>
    </div>
  );
}

export function ContentHubSkeleton() {
  return (
    <div className="max-w-[1400px]">
      {/* Header skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="h-3 w-36 rounded bg-aera-champagne/40 mb-3" />
        <div className="h-8 w-48 rounded bg-aera-champagne/60 mb-2" />
        <div className="h-4 w-80 rounded bg-aera-champagne/30" />
      </div>

      {/* Quick links skeleton */}
      <div className="flex gap-3 mb-8 animate-pulse">
        <div className="h-10 w-32 rounded-xl bg-aera-champagne/30" />
        <div className="h-10 w-28 rounded-xl bg-aera-champagne/30" />
        <div className="h-10 w-36 rounded-xl bg-aera-champagne/30" />
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 9 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
