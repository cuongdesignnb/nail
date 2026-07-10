"use client";

import React, { useState, useEffect } from "react";
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

function formatBusinessHoursString(hoursList: DaySchedule[]): string {
  const openDays = hoursList.filter((d) => d.isOpen);
  if (openDays.length === 0) return "Closed";

  const formatTime = (t: string) => {
    const [h, m] = t.split(":");
    const hr = parseInt(h);
    const ampm = hr >= 12 ? "PM" : "AM";
    const hour12 = hr % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  const groups: { [key: string]: string[] } = {};
  hoursList.forEach((day) => {
    if (!day.isOpen) {
      const key = "Closed";
      groups[key] = groups[key] || [];
      groups[key].push(day.day.slice(0, 3));
    } else {
      const key = `${formatTime(day.startTime)} – ${formatTime(day.endTime)}`;
      groups[key] = groups[key] || [];
      groups[key].push(day.day.slice(0, 3));
    }
  });

  return Object.entries(groups)
    .map(([times, days]) => {
      if (days.length === 7) return `Mon – Sun: ${times}`;
      if (
        days.length === 5 &&
        days.includes("Mon") &&
        days.includes("Fri") &&
        !days.includes("Sat") &&
        !days.includes("Sun")
      ) {
        return `Mon – Fri: ${times}`;
      }
      return `${days.join(", ")}: ${times}`;
    })
    .join(" | ");
}

export default function BusinessHoursSettings() {
  const [hours, setHours] = useState<DaySchedule[]>(DEFAULT_HOURS);
  const [version, setVersion] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/content/global", { cache: "no-store" });
        const json = await res.json();
        if (json.success && json.data) {
          const content = json.data.draftContent || {};
          if (Array.isArray(content.businessHours)) {
            setHours(content.businessHours);
          } else {
            setHours(DEFAULT_HOURS);
          }
          setVersion(json.data.version || 1);
        }
      } catch (err) {
        console.error("Failed to load business hours:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

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
      const getRes = await fetch("/api/admin/content/global", { cache: "no-store" });
      const getJson = await getRes.json();
      let currentContent = {};
      let currentVersion = version;
      if (getJson.success && getJson.data) {
        currentContent = getJson.data.draftContent || {};
        currentVersion = getJson.data.version;
      }

      const hoursString = formatBusinessHoursString(hours);

      const updatedContent = {
        ...currentContent,
        businessHours: hours,
        defaultContact: {
          ...(currentContent as any).defaultContact,
          hours: hoursString,
        },
        footer: {
          ...(currentContent as any).footer,
          contact: {
            ...(currentContent as any).footer?.contact,
            hours: hoursString,
          },
        },
      };

      const putRes = await fetch("/api/admin/content/global", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: updatedContent, version: currentVersion }),
      });
      const putJson = await putRes.json();
      if (!putRes.ok || !putJson.success) {
        throw new Error(putJson.error || "Failed to save draft");
      }

      const nextVersion = putJson.data.version;

      const publishRes = await fetch("/api/admin/content/global/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ version: nextVersion }),
      });
      const publishJson = await publishRes.json();
      if (!publishRes.ok || !publishJson.success) {
        throw new Error(publishJson.error || "Failed to publish");
      }

      setVersion(publishJson.data.version);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save business hours");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "rounded-xl border border-[var(--admin-border-strong)] bg-white px-3 py-2 text-xs text-[var(--admin-ink)] focus:border-[var(--admin-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20";

  if (loading) {
    return <div className="p-6 text-xs text-[var(--admin-muted)]">Loading business hours...</div>;
  }

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
