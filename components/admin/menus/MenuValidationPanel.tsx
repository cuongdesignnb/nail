"use client";

import { AlertCircle, CheckCircle2 } from "lucide-react";

export function MenuValidationPanel({ issues }: { issues: string[] }) {
  if (!issues.length) {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
        <CheckCircle2 className="mr-2 inline h-4 w-4" />
        Menu looks ready to save.
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
      <p className="text-sm font-bold">
        <AlertCircle className="mr-2 inline h-4 w-4" />
        {issues.length} {issues.length === 1 ? "item needs" : "items need"} attention
      </p>
      <div className="mt-2 grid gap-1 text-xs">
        {issues.slice(0, 6).map((issue) => (
          <p key={issue}>- {issue}</p>
        ))}
      </div>
    </div>
  );
}
