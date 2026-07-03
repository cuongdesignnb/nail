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
    <div style={{ display: 'flex', gap: 2 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <StarIcon
          key={star}
          size={13}
          fill={star <= rating ? '#e6a023' : 'transparent'}
          color={star <= rating ? '#e6a023' : 'rgba(116, 55, 15, 0.2)'}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                display: 'flex',
                gap: 12,
                padding: '12px',
                borderRadius: 12,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = 'rgba(155, 89, 29, 0.03)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
            >
              {/* Customer initial */}
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'rgba(155, 89, 29, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#9b591d',
                  flexShrink: 0,
                }}
              >
                {review.customer.charAt(0).toUpperCase()}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                    marginBottom: 4,
                  }}
                >
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: '#2f1c11',
                    }}
                  >
                    {review.customer}
                  </span>
                  <StarRating rating={review.rating} />
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: '#7f6d61',
                    margin: 0,
                    lineHeight: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {review.text.length > 100
                    ? review.text.slice(0, 100) + '…'
                    : review.text}
                </p>
                {review.createdAt && (
                  <span
                    style={{
                      fontSize: 11,
                      color: 'rgba(127, 109, 97, 0.7)',
                      marginTop: 4,
                      display: 'block',
                    }}
                  >
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
