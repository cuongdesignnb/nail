"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import clsx from "clsx";

export interface AdminSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const AdminSearchInput: React.FC<AdminSearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search…",
  debounceMs = 300,
}) => {
  const [internal, setInternal] = useState(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  // Sync external value changes
  useEffect(() => {
    setInternal(value);
  }, [value]);

  // Debounce internal → external
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    timerRef.current = setTimeout(() => {
      onChange(internal);
    }, debounceMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internal, debounceMs]);

  const handleClear = () => {
    setInternal("");
    onChange("");
  };

  return (
    <div className="relative w-full max-w-xs">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-aera-muted/60 pointer-events-none" />

      <input
        type="text"
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        placeholder={placeholder}
        className={clsx(
          "w-full rounded-xl border border-aera-champagne/60 bg-white py-2 pl-9 pr-8 text-xs text-aera-ink placeholder:text-aera-muted/50",
          "transition-colors focus:border-aera-accent focus:outline-none focus:ring-2 focus:ring-aera-accent/20"
        )}
      />

      {internal && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-aera-muted hover:text-aera-ink transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
};

export default AdminSearchInput;
