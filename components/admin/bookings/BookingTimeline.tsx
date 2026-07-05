"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CircleDot,
  PlayCircle,
  CalendarCheck,
} from "lucide-react";

interface TimelineEvent {
  label: string;
  timestamp: string | null;
  icon: React.ReactNode;
  color: string;
}

interface BookingTimelineProps {
  booking: {
    status: string;
    createdAt: string;
    checkedInAt?: string | null;
    completedAt?: string | null;
    cancelledAt?: string | null;
    noShowAt?: string | null;
    scheduledStartAt: string;
  };
}

function formatDt(dt: string | null | undefined): string {
  if (!dt) return "";
  return new Date(dt).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function normalizeStatus(status?: string | null) {
  return String(status || "PENDING").trim().replace(/[\s-]+/g, "_").toUpperCase();
}

export const BookingTimeline: React.FC<BookingTimelineProps> = ({ booking }) => {
  const bookingStatus = normalizeStatus(booking.status);
  const events: TimelineEvent[] = [
    {
      label: "Booking Created",
      timestamp: booking.createdAt,
      icon: <CircleDot className="h-4 w-4" />,
      color: "bg-blue-500",
    },
    {
      label: "Scheduled",
      timestamp: booking.scheduledStartAt,
      icon: <CalendarCheck className="h-4 w-4" />,
      color: "bg-indigo-500",
    },
  ];

  if (booking.checkedInAt) {
    events.push({
      label: "Checked In",
      timestamp: booking.checkedInAt,
      icon: <Clock className="h-4 w-4" />,
      color: "bg-amber-500",
    });
  }

  if (booking.completedAt) {
    events.push({
      label: "Completed",
      timestamp: booking.completedAt,
      icon: <CheckCircle2 className="h-4 w-4" />,
      color: "bg-emerald-500",
    });
  }

  if (booking.cancelledAt) {
    events.push({
      label: "Cancelled",
      timestamp: booking.cancelledAt,
      icon: <XCircle className="h-4 w-4" />,
      color: "bg-red-500",
    });
  }

  if (booking.noShowAt) {
    events.push({
      label: "No Show",
      timestamp: booking.noShowAt,
      icon: <AlertTriangle className="h-4 w-4" />,
      color: "bg-gray-500",
    });
  }

  // Add current status if no terminal event
  if (!booking.completedAt && !booking.cancelledAt && !booking.noShowAt) {
    const statusMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
      CONFIRMED: { label: "Confirmed", color: "bg-blue-500", icon: <CheckCircle2 className="h-4 w-4" /> },
      IN_PROGRESS: { label: "In Progress", color: "bg-amber-500", icon: <PlayCircle className="h-4 w-4" /> },
    };
    const current = statusMap[bookingStatus];
    if (current) {
      events.push({
        label: current.label,
        timestamp: null,
        icon: current.icon,
        color: current.color,
      });
    }
  }

  return (
    <div className="relative pl-6">
      {/* Vertical line */}
      <div className="absolute left-[11px] top-2 bottom-2 w-px bg-aera-champagne/60" />

      <div className="space-y-5">
        {events.map((event, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.3 }}
            className="relative flex items-start gap-3"
          >
            {/* Dot */}
            <div
              className={`absolute -left-6 flex h-[22px] w-[22px] items-center justify-center rounded-full text-white ${event.color}`}
            >
              {event.icon}
            </div>

            <div className="min-w-0 pt-0.5">
              <p className="text-xs font-semibold text-aera-ink">
                {event.label}
              </p>
              {event.timestamp && (
                <p className="text-[11px] text-aera-muted mt-0.5">
                  {formatDt(event.timestamp)}
                </p>
              )}
              {!event.timestamp && (
                <p className="text-[11px] text-aera-muted mt-0.5 italic">
                  Current status
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BookingTimeline;
