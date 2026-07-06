"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Star,
  DollarSign,
  CalendarCheck,
  CalendarDays,
  Sparkles,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import { AdminSectionCard } from "@/components/admin/ui";

interface TechnicianProfileProps {
  technician: any;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color }) => (
  <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${color}`}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-muted)]">
          {label}
        </p>
        <p className="text-lg font-bold text-[var(--admin-ink)]">{value}</p>
      </div>
    </div>
  </div>
);

export const TechnicianProfile: React.FC<TechnicianProfileProps> = ({
  technician,
}) => {
  const stats = technician.stats || {};
  const upcomingBookings = technician.upcomingBookings || [];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-[var(--admin-border)] bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {technician.avatar ? (
            <img
              src={technician.avatar}
              alt={technician.name}
              className="h-16 w-16 shrink-0 rounded-2xl object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--admin-accent-soft)]">
              <User className="h-8 w-8 text-[var(--admin-accent)]" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-[var(--admin-ink)] font-heading">
              {technician.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--admin-surface-muted)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[var(--admin-ink)]">
                <Sparkles className="h-3 w-3 text-[var(--admin-accent)]" />
                {technician.role}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-[var(--admin-muted)]">
                <Star className="h-3.5 w-3.5 text-amber-500" />
                {technician.specialty}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                  technician.isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    technician.isActive ? "bg-emerald-500" : "bg-gray-400"
                  }`}
                />
                {technician.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <StatCard
          icon={<CalendarCheck className="h-5 w-5 text-emerald-600" />}
          label="Completed"
          value={stats.completedCount || 0}
          color="bg-emerald-50"
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5 text-blue-600" />}
          label="Upcoming"
          value={stats.upcomingCount || 0}
          color="bg-blue-50"
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-[var(--admin-accent)]" />}
          label="Revenue"
          value={`$${(stats.totalRevenue || 0).toFixed(2)}`}
          color="bg-amber-50"
        />
        <StatCard
          icon={<Star className="h-5 w-5 text-amber-500" />}
          label="Rating"
          value={stats.rating?.toFixed(1) || "5.0"}
          color="bg-purple-50"
        />
      </motion.div>

      {/* Upcoming Bookings */}
      <AdminSectionCard
        title="Upcoming Bookings"
        icon={CalendarDays}
        badge={
          <span className="rounded-full bg-[var(--admin-accent-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--admin-muted)]">
            {upcomingBookings.length}
          </span>
        }
      >
        {upcomingBookings.length > 0 ? (
          <div className="space-y-2">
            {upcomingBookings.map((booking: any) => (
              <a
                key={booking.id}
                href={`/admin/bookings/${booking.id}`}
                className="flex items-center justify-between rounded-xl bg-[var(--admin-surface-muted)] px-4 py-3 transition-colors hover:bg-[var(--admin-surface-hover)]"
              >
                <div>
                  <p className="text-xs font-semibold text-[var(--admin-ink)]">
                    {booking.customer?.firstName} {booking.customer?.lastName}
                  </p>
                  <p className="text-[11px] text-[var(--admin-muted)] mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {format(
                      new Date(booking.scheduledStartAt),
                      "MMM d, yyyy · h:mm a"
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {booking.items?.map((item: any) => (
                    <span
                      key={item.id}
                      className="rounded-full bg-[var(--admin-surface-muted)] px-2 py-0.5 text-[10px] font-bold text-[var(--admin-ink)]"
                    >
                      {item.service?.name}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[var(--admin-muted)] py-4 text-center">
            No upcoming bookings.
          </p>
        )}
      </AdminSectionCard>
    </div>
  );
};

export default TechnicianProfile;
