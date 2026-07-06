"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import clsx from "clsx";
import { Calendar, ChevronDown } from "lucide-react";

export interface AdminDateRangePickerProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

interface PresetOption {
  value: string;
  label: string;
}

const presets: PresetOption[] = [
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "this_month", label: "This Month" },
  { value: "this_year", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];

export const AdminDateRangePicker: React.FC<AdminDateRangePickerProps> = ({
  value,
  onChange,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const isCustom = value === "custom" || value.includes(":");
  const selectedPreset = presets.find((p) => p.value === value);
  const displayLabel = selectedPreset
    ? selectedPreset.label
    : isCustom
    ? `${customFrom || "..."} → ${customTo || "..."}`
    : value;

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, handleClickOutside]);

  // Parse custom value on mount
  useEffect(() => {
    if (value.includes(":")) {
      const [from, to] = value.split(":");
      setCustomFrom(from);
      setCustomTo(to);
    }
  }, [value]);

  const handlePresetSelect = (preset: string) => {
    if (preset === "custom") {
      onChange("custom");
    } else {
      onChange(preset);
      setIsOpen(false);
    }
  };

  const handleCustomApply = () => {
    if (customFrom && customTo) {
      onChange(`${customFrom}:${customTo}`);
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={clsx("relative inline-block", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          "inline-flex items-center gap-2 h-9 px-3",
          "rounded-[var(--admin-radius-md)] border border-[var(--admin-border-strong)]",
          "bg-[var(--admin-surface)] text-sm text-[var(--admin-ink)]",
          "transition-all duration-[var(--admin-transition-fast)]",
          "hover:bg-[var(--admin-surface-hover)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none"
        )}
      >
        <Calendar className="h-4 w-4 text-[var(--admin-muted)]" aria-hidden="true" />
        <span className="font-medium">{displayLabel}</span>
        <ChevronDown
          className={clsx(
            "h-3.5 w-3.5 text-[var(--admin-muted)] transition-transform duration-[var(--admin-transition-fast)]",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div
          className={clsx(
            "absolute right-0 top-full mt-2 w-64",
            "rounded-[var(--admin-radius-lg)] border border-[var(--admin-border)]",
            "bg-[var(--admin-surface)] shadow-[var(--admin-shadow-lg)]",
            "z-[var(--admin-z-dropdown)] overflow-hidden",
            "animate-[admin-scale-in_0.15s_ease-out]"
          )}
        >
          {/* Preset options */}
          <div className="p-1.5">
            {presets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => handlePresetSelect(preset.value)}
                className={clsx(
                  "w-full text-left px-3 py-2 text-sm rounded-[var(--admin-radius-sm)]",
                  "transition-colors duration-[var(--admin-transition-fast)]",
                  (value === preset.value || (isCustom && preset.value === "custom"))
                    ? "bg-[var(--admin-accent-soft)] text-[var(--admin-accent)] font-medium"
                    : "text-[var(--admin-ink)] hover:bg-[var(--admin-surface-hover)]"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Custom date inputs */}
          {(value === "custom" || isCustom) && (
            <div className="border-t border-[var(--admin-border)] p-3 space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[var(--admin-muted)] uppercase tracking-wider">
                  From
                </label>
                <input
                  type="date"
                  value={customFrom}
                  onChange={(e) => setCustomFrom(e.target.value)}
                  className={clsx(
                    "w-full h-8 px-2 text-xs rounded-[var(--admin-radius-sm)]",
                    "border border-[var(--admin-border-strong)] bg-[var(--admin-surface)]",
                    "text-[var(--admin-ink)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20 focus:border-[var(--admin-accent)]"
                  )}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-[var(--admin-muted)] uppercase tracking-wider">
                  To
                </label>
                <input
                  type="date"
                  value={customTo}
                  onChange={(e) => setCustomTo(e.target.value)}
                  className={clsx(
                    "w-full h-8 px-2 text-xs rounded-[var(--admin-radius-sm)]",
                    "border border-[var(--admin-border-strong)] bg-[var(--admin-surface)]",
                    "text-[var(--admin-ink)]",
                    "focus:outline-none focus:ring-2 focus:ring-[var(--admin-accent)]/20 focus:border-[var(--admin-accent)]"
                  )}
                />
              </div>
              <button
                type="button"
                onClick={handleCustomApply}
                disabled={!customFrom || !customTo}
                className={clsx(
                  "w-full h-8 rounded-[var(--admin-radius-sm)]",
                  "bg-[var(--admin-accent)] text-white text-xs font-semibold",
                  "hover:bg-[var(--admin-accent-hover)]",
                  "transition-colors duration-[var(--admin-transition-fast)]",
                  "disabled:opacity-40 disabled:pointer-events-none"
                )}
              >
                Apply
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDateRangePicker;
