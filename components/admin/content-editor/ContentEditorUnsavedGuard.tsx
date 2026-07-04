"use client";

import { useEffect } from "react";

interface ContentEditorUnsavedGuardProps {
  isDirty: boolean;
}

/**
 * Warns the user when they attempt to navigate away with unsaved changes.
 * Uses the browser's native beforeunload event.
 */
export function ContentEditorUnsavedGuard({ isDirty }: ContentEditorUnsavedGuardProps) {
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  return null;
}
