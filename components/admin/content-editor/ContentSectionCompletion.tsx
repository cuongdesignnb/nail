"use client";

import { CheckCircle2, AlertCircle } from "lucide-react";

interface ContentSectionCompletionProps {
  complete: boolean;
  /** Optional size variant */
  size?: "sm" | "md";
}

/**
 * Section-level completion indicator.
 * Shows a checkmark when the section is complete, or a warning icon if content is missing.
 */
export function ContentSectionCompletion({
  complete,
  size = "sm",
}: ContentSectionCompletionProps) {
  const iconSize = size === "sm" ? 13 : 15;

  if (complete) {
    return (
      <span className="inline-flex items-center" title="Section complete">
        <CheckCircle2 size={iconSize} className="text-green-600 flex-shrink-0" />
      </span>
    );
  }

  return (
    <span className="inline-flex items-center" title="Section needs content">
      <AlertCircle size={iconSize} className="text-amber-500 flex-shrink-0" />
    </span>
  );
}
