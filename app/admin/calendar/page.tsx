"use client";

import React, { useEffect, useState, useCallback } from "react";
import { format, startOfWeek, addDays, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
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
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  Pending: "var(--admin-warning)",
  Confirmed: "var(--admin-success)",
  "Checked In": "var(--admin-accent)",
  "In Service": "var(--admin-accent-hover)",
  Completed: "var(--admin-neutral)",
  Cancelled: "var(--admin-danger)",
  "No Show": "var(--admin-muted)",
};

export default function AdminCalendarPage() {
  const [bookings, setBookings] = useState<CalendarBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/bookings");
      if (res.status === 401) { window.location.href = "/login?next=/admin/calendar"; return; }
      const json = await res.json();
      setBookings(json.data || []);
    } catch { setBookings([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8am-7pm

  const getBookingsForSlot = (day: Date, hour: number) => {
    return bookings.filter((b) => {
      const d = parseISO(b.scheduledStartAt);
      return d.getDate() === day.getDate() && d.getMonth() === day.getMonth() && d.getHours() === hour;
    });
  };

  const isToday = (d: Date) => d.toDateString() === new Date().toDateString();

  return (
    <div className="admin-page-container">
      <AdminPageHeader
        eyebrow="Operations"
        title="Calendar"
        description="Weekly appointment view"
        actions={
          <div className="flex items-center gap-2">
            <AdminIconButton
              aria-label="Previous week"
              variant="default"
              size="sm"
              onClick={() => setWeekStart((d) => addDays(d, -7))}
            >
              <ChevronLeft size={16} />
            </AdminIconButton>
            <span className="min-w-[200px] text-center text-sm font-bold text-[var(--admin-ink)]">
              {format(weekStart, "MMM d")} — {format(addDays(weekStart, 6), "MMM d, yyyy")}
            </span>
            <AdminIconButton
              aria-label="Next week"
              variant="default"
              size="sm"
              onClick={() => setWeekStart((d) => addDays(d, 7))}
            >
              <ChevronRight size={16} />
            </AdminIconButton>
            <AdminButton
              variant="tertiary"
              size="sm"
              onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
            >
              Today
            </AdminButton>
          </div>
        }
      />

      {loading ? (
        <AdminLoadingState variant="table" />
      ) : (
        <div className="overflow-auto rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)] bg-[var(--admin-surface)] shadow-[var(--admin-shadow-sm)]">
          <table className="w-full min-w-[800px] border-collapse">
            <thead>
              <tr>
                <th className="w-[60px] border-b border-r border-[var(--admin-border)] px-2 py-3 text-center">
                  <Clock size={14} className="mx-auto text-[var(--admin-muted)]" />
                </th>
                {days.map((d) => (
                  <th
                    key={d.toISOString()}
                    className={`border-b border-r border-[var(--admin-border)] px-2 py-3 text-center ${
                      isToday(d) ? "bg-[var(--admin-accent-soft)]" : ""
                    }`}
                  >
                    <div className="text-[11px] text-[var(--admin-muted)]">{format(d, "EEE")}</div>
                    <div
                      className={`text-base font-bold ${
                        isToday(d) ? "text-[var(--admin-accent)]" : "text-[var(--admin-ink)]"
                      }`}
                    >
                      {format(d, "d")}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {hours.map((hour) => (
                <tr key={hour}>
                  <td className="border-r border-[var(--admin-border-muted)] px-2 py-2 text-center text-[11px] text-[var(--admin-muted)]">
                    {hour > 12 ? `${hour - 12}pm` : hour === 12 ? "12pm" : `${hour}am`}
                  </td>
                  {days.map((day) => {
                    const slot = getBookingsForSlot(day, hour);
                    return (
                      <td
                        key={day.toISOString() + hour}
                        className={`h-[60px] border-b border-r border-[var(--admin-border-muted)] p-1 align-top ${
                          isToday(day) ? "bg-[var(--admin-accent-soft)]/30" : ""
                        }`}
                      >
                        {slot.map((b) => {
                          const color = STATUS_COLORS[b.status] || "var(--admin-accent)";
                          return (
                            <div
                              key={b.id}
                              className="mb-0.5 cursor-pointer rounded-[var(--admin-radius-xs)] px-2 py-1 text-[11px] transition-opacity hover:opacity-80"
                              style={{
                                borderLeft: `3px solid ${color}`,
                                backgroundColor: `color-mix(in srgb, ${color} 8%, transparent)`,
                              }}
                            >
                              <div className="font-bold text-[var(--admin-ink)]">{b.customerName}</div>
                              <div className="text-[var(--admin-muted)]">{b.services[0]}</div>
                            </div>
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
