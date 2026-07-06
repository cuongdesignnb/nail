"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Copy, Eye, EyeOff, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

type MenuActionMenuProps = {
  hidden: boolean;
  canAddChild: boolean;
  canIndent: boolean;
  canOutdent: boolean;
  onEdit: () => void;
  onAddChild: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onIndent: () => void;
  onOutdent: () => void;
  onToggleEnabled: () => void;
  onDelete: () => void;
};

export function MenuActionMenu({
  hidden,
  canAddChild,
  canIndent,
  canOutdent,
  onEdit,
  onAddChild,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  onIndent,
  onOutdent,
  onToggleEnabled,
  onDelete,
}: MenuActionMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocumentClick(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocumentClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocumentClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function run(action: () => void) {
    action();
    setOpen(false);
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        aria-label="Open item actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((value) => !value);
        }}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--admin-muted)] transition hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-11 z-30 w-56 rounded-2xl border border-[var(--admin-border-strong)] bg-white p-2 shadow-2xl">
          <MenuAction icon={<Pencil className="h-4 w-4" />} label="Edit" onClick={() => run(onEdit)} />
          {canAddChild && <MenuAction icon={<Plus className="h-4 w-4" />} label="Add Child" onClick={() => run(onAddChild)} />}
          <MenuAction icon={<Copy className="h-4 w-4" />} label="Duplicate" onClick={() => run(onDuplicate)} />
          <div className="my-1 h-px bg-[var(--admin-accent-soft)]" />
          <MenuAction icon={<ArrowUp className="h-4 w-4" />} label="Move Up" onClick={() => run(onMoveUp)} />
          <MenuAction icon={<ArrowDown className="h-4 w-4" />} label="Move Down" onClick={() => run(onMoveDown)} />
          {canIndent && <MenuAction icon={<ArrowRight className="h-4 w-4" />} label="Indent" onClick={() => run(onIndent)} />}
          {canOutdent && <MenuAction icon={<ArrowLeft className="h-4 w-4" />} label="Outdent" onClick={() => run(onOutdent)} />}
          <div className="my-1 h-px bg-[var(--admin-accent-soft)]" />
          <MenuAction icon={hidden ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />} label={hidden ? "Show" : "Hide"} onClick={() => run(onToggleEnabled)} />
          <MenuAction danger icon={<Trash2 className="h-4 w-4" />} label="Delete" onClick={() => run(onDelete)} />
        </div>
      )}
    </div>
  );
}

function MenuAction({ icon, label, danger, onClick }: { icon: ReactNode; label: string; danger?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
      className={`flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 ${danger ? "text-red-600 hover:bg-red-50" : "text-[var(--admin-ink)] hover:bg-[var(--admin-surface-hover)]"}`}
    >
      {icon}
      {label}
    </button>
  );
}
