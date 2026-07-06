"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Save } from "lucide-react";
import { AdminToggle } from "@/components/admin/ui";

interface DaySchedule {
  day: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

const DEFAULT_HOURS: DaySchedule[] = [
  { day: "Monday", isOpen: true, startTime: "09:00", endTime: "19:00" },
  { day: "Tuesday", isOpen: true, startTime: "09:00", endTime: "19:00" },
  { day: "Wednesday", isOpen: true, startTime: "09:00", endTime: "19:00" },
  { day: "Thursday", isOpen: true, startTime: "09:00", endTime: "20:00" },
  { day: "Friday", isOpen: true, startTime: "09:00", endTime: "20:00" },
  { day: "Saturday", isOpen: true, startTime: "10:00", endTime: "18:00" },
  { day: "Sunday", isOpen: false, startTime: "10:00", endTime: "16:00" },
];

const STORAGE_KEY = "aera_business_hours";

function loadHours(): DaySchedule[] {
  if (typeof window === "undefined") return DEFAULT_HOURS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return DEFAULT_HOURS;
}

export default function BusinessHoursSettings() {
  const [hours, setHours] = useState<DaySchedule[]>(loadHours);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const updateDay = (index: number, field: keyof DaySchedule, value: string | boolean) => {
    setHours((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(hours));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl space-y-6"
    >
      <div className="rounded-2xl border border-[var(--admin-border)] bg-white p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--admin-surface-muted)]">
            <Clock className="h-4.5 w-4.5 text-[var(--admin-accent)]" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--admin-ink)]">Business Hours</h3>
            <p className="text-[11px] text-[var(--admin-muted)]">Set operating hours for each day of the week</p>
          </div>
        </div>

        <div className="space-y-3">
          {hours.map((day, i) => (
            <div
              key={day.day}
              className={`flex items-center gap-4 rounded-xl p-3 transition-colors ${
                day.isOpen ? "bg-[var(--admin-surface-muted)]" : "bg-gray-50"
              }`}
            >
              <div className="w-28 shrink-0">
                <span className={`text-xs font-semibold ${day.isOpen ? "text-[var(--admin-ink)]" : "text-[var(--admin-muted)]"}`}>
                  {day.day}
                </span>
              </div>

              <AdminToggle
                checked={day.isOpen}
                onChange={(val) => updateDay(i, "isOpen", val)}
              />

              {day.isOpen ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={day.startTime}
                    onChange={(e) => updateDay(i, "startTime", e.target.value)}
                    className={inputClass}
                  />
                  <span className="text-xs text-[var(--admin-muted)]">–</span>
                  <input
                    type="time"
                    value={day.endTime}
                    onChange={(e) => updateDay(i, "endTime", e.target.value)}
                    className={inputClass}
                  />
                </div>
              ) : (
                <span className="text-xs text-[var(--admin-muted)] italic">Closed</span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-[var(--admin-accent-hover)] disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Saving..." : saved ? "Saved!" : "Save Hours"}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
