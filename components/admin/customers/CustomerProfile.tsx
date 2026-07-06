"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Star,
  CalendarDays,
} from "lucide-react";
import { format } from "date-fns";
import { AdminSectionCard } from "@/components/admin/ui";

interface CustomerProfileProps {
  customer: any;
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

export const CustomerProfile: React.FC<CustomerProfileProps> = ({
  customer,
}) => {
  const stats = customer.stats || {};

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
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--admin-accent-soft)]">
            <User className="h-8 w-8 text-[var(--admin-accent)]" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-xl font-bold text-[var(--admin-ink)] font-heading">
              {customer.firstName} {customer.lastName}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--admin-muted)]">
                <Mail className="h-3.5 w-3.5" />
                {customer.email}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--admin-muted)]">
                <Phone className="h-3.5 w-3.5" />
                {customer.phone}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-[var(--admin-muted)]">
                <Calendar className="h-3.5 w-3.5" />
                Member since{" "}
                {format(new Date(customer.createdAt), "MMM yyyy")}
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
          icon={<CalendarDays className="h-5 w-5 text-blue-600" />}
          label="Total Visits"
          value={stats.totalBookings || 0}
          color="bg-blue-50"
        />
        <StatCard
          icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
          label="Total Spend"
          value={`$${(stats.totalSpend || 0).toFixed(2)}`}
          color="bg-emerald-50"
        />
        <StatCard
          icon={<Star className="h-5 w-5 text-amber-600" />}
          label="Completed"
          value={stats.completedBookings || 0}
          color="bg-amber-50"
        />
        <StatCard
          icon={<Calendar className="h-5 w-5 text-purple-600" />}
          label="Member Since"
          value={
            stats.memberSince
              ? format(new Date(stats.memberSince), "MMM yyyy")
              : "—"
          }
          color="bg-purple-50"
        />
      </motion.div>

      {/* Booking History */}
      <AdminSectionCard
        title="Booking History"
        icon={CalendarDays}
        badge={
          <span className="rounded-full bg-[var(--admin-accent-soft)] px-2 py-0.5 text-[10px] font-bold text-[var(--admin-muted)]">
            {customer.bookings?.length || 0}
          </span>
        }
      >
        {customer.bookings?.length > 0 ? (
          <div className="space-y-2">
            {customer.bookings.map((booking: any) => {
              const statusColors: Record<string, string> = {
                COMPLETED: "bg-emerald-50 text-emerald-700",
                CONFIRMED: "bg-blue-50 text-blue-700",
                PENDING: "bg-amber-50 text-amber-700",
                CANCELLED: "bg-red-50 text-red-700",
                NO_SHOW: "bg-gray-50 text-gray-700",
                IN_PROGRESS: "bg-purple-50 text-purple-700",
                CHECKED_IN: "bg-indigo-50 text-indigo-700",
              };
              return (
                <a
                  key={booking.id}
                  href={`/admin/bookings/${booking.id}`}
                  className="flex items-center justify-between rounded-xl bg-[var(--admin-surface-muted)] px-4 py-3 transition-colors hover:bg-[var(--admin-surface-hover)]"
                >
                  <div>
                    <p className="text-xs font-semibold text-[var(--admin-ink)]">
                      {booking.bookingCode}
                    </p>
                    <p className="text-[11px] text-[var(--admin-muted)] mt-0.5">
                      {format(
                        new Date(booking.scheduledStartAt),
                        "MMM d, yyyy · h:mm a"
                      )}
                      {booking.technician &&
                        ` · ${booking.technician.name}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[var(--admin-ink)]">
                      ${Number(booking.totalAmount).toFixed(2)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        statusColors[booking.status] || "bg-gray-50 text-gray-700"
                      }`}
                    >
                      {booking.status.replace(/_/g, " ")}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[var(--admin-muted)] py-4 text-center">
            No bookings yet.
          </p>
        )}
      </AdminSectionCard>
    </div>
  );
};

export default CustomerProfile;
