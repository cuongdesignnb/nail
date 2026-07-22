"use client";

import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { addDays, format, parseISO, startOfWeek } from "date-fns";
import { AlertCircle, ChevronLeft, ChevronRight, Clock, RefreshCw } from "lucide-react";
import { bookingCalendarPosition } from "@/lib/bookings/calendar";
import type { BusinessHour } from "@/lib/settings/settings.types";
import {
  AdminPageHeader,
  AdminLoadingState,
  AdminIconButton,
  AdminButton,
} from "@/components/admin/ui";

interface CalendarBooking {
  id: string;
  bookingCode: string;
  customerName: string;
  services: string[];
  technician: string;
  scheduledStartAt: string;
  scheduledEndAt: string;
  status: string;
}

const STATUS_STYLES: Record<string, { card: string; dot: string }> = {
  PENDING: { card: "border-l-amber-500 bg-amber-50", dot: "bg-amber-500" },
  CONFIRMED: { card: "border-l-emerald-500 bg-emerald-50", dot: "bg-emerald-500" },
  CHECKED_IN: { card: "border-l-sky-500 bg-sky-50", dot: "bg-sky-500" },
  IN_SERVICE: { card: "border-l-violet-500 bg-violet-50", dot: "bg-violet-500" },
  COMPLETED: { card: "border-l-slate-500 bg-slate-50", dot: "bg-slate-500" },
  CANCELLED: { card: "border-l-red-500 bg-red-50", dot: "bg-red-500" },
  NO_SHOW: { card: "border-l-zinc-500 bg-zinc-50", dot: "bg-zinc-500" },
};

function normalizeStatus(status: string) {
  return status.trim().replace(/[\s-]+/g, "_").toUpperCase();
}

function statusLabel(status: string) {
  return normalizeStatus(status)
    .toLowerCase()
    .replace(/(^|_)([a-z])/g, (_, prefix: string, letter: string) => `${prefix ? " " : ""}${letter.toUpperCase()}`);
}

function hourFromTime(value: string, roundUp = false) {
  const [hours, minutes] = value.split(":").map(Number);
  if (!Number.isFinite(hours)) return null;
  return Math.min(24, Math.max(0, hours + (roundUp && minutes > 0 ? 1 : 0)));
}

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weekKey, setWeekKey] = useState("current");
  const [resolvedWeekStart, setResolvedWeekStart] = useState<Date | null>(null);
  const [timezone, setTimezone] = useState("UTC");
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ calendarWeek: weekKey, limit: "2000" });
      const res = await fetch(`/api/admin/bookings?${params}`, { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/login?next=/admin/calendar";
        return;
      }
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Unable to load calendar bookings.");
      if (!json.meta?.calendarWeekStart || !json.meta?.timezone) {
        throw new Error("Calendar metadata is missing from the booking response.");
      }
      setBookings(Array.isArray(json.data) ? json.data : []);
      setResolvedWeekStart(parseISO(json.meta.calendarWeekStart));
      setTimezone(json.meta.timezone);
      setBusinessHours(Array.isArray(json.meta.businessHours) ? json.meta.businessHours : []);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : "Unable to load calendar bookings.");
    } finally {
      setLoading(false);
    }
  }, [weekKey]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const displayWeekStart = resolvedWeekStart || startOfWeek(new Date(), { weekStartsOn: 1 });
  const days = useMemo(
    () => Array.from({ length: 7 }, (_, index) => addDays(displayWeekStart, index)),
    [displayWeekStart],
  );
  const positionedBookings = useMemo(
    () => bookings.map((booking) => ({
      ...booking,
      position: bookingCalendarPosition(booking.scheduledStartAt, timezone),
      endPosition: bookingCalendarPosition(booking.scheduledEndAt, timezone),
    })),
    [bookings, timezone],
  );
  const hours = useMemo(() => {
    const openDays = businessHours.filter((day) => day.isOpen);
    const openingHours = openDays.map((day) => hourFromTime(day.startTime)).filter((hour): hour is number => hour !== null);
    const closingHours = openDays.map((day) => hourFromTime(day.endTime, true)).filter((hour): hour is number => hour !== null);
    const bookingStartHours = positionedBookings.map((booking) => booking.position.hour);
    const bookingEndHours = positionedBookings.map((booking) => booking.endPosition.hour + (booking.endPosition.minute > 0 ? 1 : 0));
    const firstHour = Math.max(0, Math.min(...(openingHours.length ? openingHours : [8]), ...(bookingStartHours.length ? bookingStartHours : [8])));
    const lastHour = Math.min(24, Math.max(...(closingHours.length ? closingHours : [20]), ...(bookingEndHours.length ? bookingEndHours : [20]), firstHour + 1));
    return Array.from({ length: lastHour - firstHour }, (_, index) => firstHour + index);
  }, [businessHours, positionedBookings]);

  const getBookingsForSlot = (day: Date, hour: number) => {
    const dateKey = format(day, "yyyy-MM-dd");
    return positionedBookings.filter((booking) => booking.position.dateKey === dateKey && booking.position.hour === hour);
  };

  const isToday = (day: Date) => format(day, "yyyy-MM-dd") === bookingCalendarPosition(new Date().toISOString(), timezone).dateKey;
  const moveWeek = (offset: number) => setWeekKey(format(addDays(displayWeekStart, offset), "yyyy-MM-dd"));
  const goToCurrentWeek = () => weekKey === "current" ? void fetchData() : setWeekKey("current");

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        eyebrow="Operations"
        title="Calendar"
        description={`Weekly appointment view · ${timezone}`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <AdminIconButton aria-label="Previous week" variant="default" size="sm" disabled={!resolvedWeekStart} onClick={() => moveWeek(-7)}>
              <ChevronLeft size={16} />
            </AdminIconButton>
            <span className="min-w-[200px] text-center text-sm font-bold text-[var(--admin-ink)]">
              {format(displayWeekStart, "MMM d")} — {format(addDays(displayWeekStart, 6), "MMM d, yyyy")}
            </span>
            <AdminIconButton aria-label="Next week" variant="default" size="sm" disabled={!resolvedWeekStart} onClick={() => moveWeek(7)}>
              <ChevronRight size={16} />
            </AdminIconButton>
            <AdminButton variant="tertiary" size="sm" onClick={goToCurrentWeek}>Today</AdminButton>
            <AdminIconButton aria-label="Refresh calendar" variant="default" size="sm" disabled={loading} onClick={() => void fetchData()}>
              <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            </AdminIconButton>
          </div>
        }
      />

      {error && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-[var(--admin-radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span className="flex items-center gap-2"><AlertCircle size={16} />{error}</span>
          <AdminButton variant="tertiary" size="sm" onClick={() => void fetchData()}>Retry</AdminButton>
        </div>
      )}

      {loading && !resolvedWeekStart ? (
        <AdminLoadingState variant="table" />
      ) : (
        <div className="overflow-auto rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow-sm)]">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                <th className="w-[72px] border-b border-r border-[var(--admin-border)] px-2 py-3 text-center">
                  <Clock size={14} className="mx-auto text-[var(--admin-muted)]" />
                </th>
                {days.map((day) => (
                  <th key={day.toISOString()} className={`border-b border-r border-[var(--admin-border)] px-2 py-3 text-center ${isToday(day) ? "bg-[var(--admin-accent-soft)]" : ""}`}>
                    <div className="text-[11px] text-[var(--admin-muted)]">{format(day, "EEE")}</div>
                    <div className={`text-base font-bold ${isToday(day) ? "text-[var(--admin-accent)]" : "text-[var(--admin-ink)]"}`}>{format(day, "d")}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => (
                <tr key={hour}>
                  <td className="border-r border-[var(--admin-border-muted)] px-2 py-2 text-center text-[11px] text-[var(--admin-muted)]">
                    {hour > 12 ? `${hour - 12}pm` : hour === 12 ? "12pm" : hour === 0 ? "12am" : `${hour}am`}
                  </td>
                  {days.map((day) => {
                    const slot = getBookingsForSlot(day, hour);
                    return (
                      <td key={`${format(day, "yyyy-MM-dd")}-${hour}`} className={`h-[72px] border-b border-r border-[var(--admin-border-muted)] p-1 align-top ${isToday(day) ? "bg-[var(--admin-accent-soft)]/30" : ""}`}>
                        {slot.map((booking) => {
                          const normalizedStatus = normalizeStatus(booking.status);
                          const styles = STATUS_STYLES[normalizedStatus] || STATUS_STYLES.PENDING;
                          return (
                            <Link
                              key={booking.id}
                              href={`/admin/bookings/${booking.id}`}
                              className={`mb-1 block rounded-[var(--admin-radius-xs)] border-l-4 px-2 py-1.5 text-[11px] transition-shadow hover:shadow-sm ${styles.card}`}
                            >
                              <div className="flex items-start justify-between gap-1">
                                <span className="font-bold text-[var(--admin-ink)]">{booking.customerName}</span>
                                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${styles.dot}`} title={statusLabel(booking.status)} />
                              </div>
                              <div className="font-semibold text-[var(--admin-ink-secondary)]">{format(booking.position.zoned, "h:mm a")} · {booking.bookingCode}</div>
                              <div className="truncate text-[var(--admin-muted)]">{booking.services[0] || "Appointment"}</div>
                              <div className="truncate text-[var(--admin-muted)]">{booking.technician}</div>
                            </Link>
                          );
                        })}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
