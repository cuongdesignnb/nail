'use client';

import React from 'react';
import { MessageSquare, Star as StarIcon } from 'lucide-react';
import type { DashboardOverview } from '@/lib/dashboard/dashboard.types';
import DashboardCard from './DashboardCard';
import DashboardEmptyState from './DashboardEmptyState';

interface RecentReviewsCardProps {
  reviews: DashboardOverview['recentReviews'];
  loading?: boolean;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          size={13}
          fill={star <= rating ? 'var(--admin-warning)' : 'transparent'}
          className={
            star <= rating
              ? 'text-[var(--admin-warning)]'
              : 'text-[var(--admin-border)]'
          }
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

export default function RecentReviewsCard({
  reviews,
  loading = false,
}: RecentReviewsCardProps) {
  return (
    <DashboardCard
      title="Recent Reviews"
      icon={MessageSquare}
      loading={loading}
      action={{ label: 'View All', href: '/admin/reviews' }}
    >
      {reviews.length === 0 ? (
        <DashboardEmptyState
          icon={MessageSquare}
          message="No approved reviews yet."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group flex gap-3 rounded-[var(--admin-radius-md)] p-3 transition-colors duration-150 hover:bg-[var(--admin-accent-soft)]/30"
            >
              {/* Customer initial */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-[var(--admin-accent-soft)] text-sm font-bold text-[var(--admin-accent)]">
                {review.customer.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold text-[var(--admin-ink)]">
                    {review.customer}
                  </span>
                  <StarRating rating={review.rating} />
                </div>
                <p className="m-0 line-clamp-2 text-xs leading-relaxed text-[var(--admin-muted)]">
                  {review.text.length > 100
                    ? review.text.slice(0, 100) + '…'
                    : review.text}
                </p>
                {review.createdAt && (
                  <span className="mt-1 block text-[11px] text-[var(--admin-muted)]/70">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
