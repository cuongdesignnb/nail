"use client";

import { ChevronDown, ChevronRight, Copy, Eye, EyeOff, GripVertical, MoreHorizontal, Pencil, Plus, Trash2, CornerDownRight, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import type { ReactNode } from "react";
import type { FlatMenuItem } from "./menu-tree.utils";

type MenuTreeItemProps = {
  item: FlatMenuItem;
  selected: boolean;
  expanded: boolean;
  canAddChild: boolean;
  onSelect: (id: string) => void;
  onToggleExpanded: (id: string) => void;
  onAddChild: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleEnabled: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, direction: -1 | 1) => void;
  onIndent: (id: string) => void;
  onOutdent: (id: string) => void;
};

export function MenuTreeItem({
  item,
  selected,
  expanded,
  canAddChild,
  onSelect,
  onToggleExpanded,
  onAddChild,
  onDuplicate,
  onToggleEnabled,
  onDelete,
  onMove,
  onIndent,
  onOutdent,
}: MenuTreeItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const childCount = item.children?.length || 0;
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "group rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-aera-accent/30 hover:bg-aera-champagne/10 hover:shadow-md",
        selected ? "border-aera-accent bg-aera-accent/10 shadow-md ring-1 ring-aera-accent/20" : "border-aera-champagne/40",
        item.isEnabled === false && "opacity-60",
        isDragging && "opacity-40"
      )}
    >
      <div className="flex min-h-[62px] items-center gap-2 px-3 py-2" style={{ paddingLeft: `${12 + (item.depth - 1) * 22}px` }}>
        <button
          type="button"
          aria-label={`Drag ${item.label || "menu item"}`}
          className="flex h-10 w-8 items-center justify-center rounded-xl text-aera-muted hover:bg-aera-champagne/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={expanded ? "Collapse submenu" : "Expand submenu"}
          aria-expanded={expanded}
          onClick={() => onToggleExpanded(item.id)}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-aera-muted hover:bg-aera-champagne/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40"
        >
          {childCount ? expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" /> : <CornerDownRight className="h-4 w-4 opacity-30" />}
        </button>
        <button type="button" onClick={() => onSelect(item.id)} className="min-w-0 flex-1 text-left focus-visible:outline-none">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-bold text-aera-ink">{item.label || "Untitled link"}</span>
            <span className="max-w-[180px] truncate rounded-full bg-aera-ivory px-2.5 py-1 text-[10px] font-semibold text-aera-muted">{item.type === "none" ? "Submenu only" : item.href || "Needs destination"}</span>
            {childCount > 0 && <span className="rounded-full bg-aera-champagne/40 px-2.5 py-1 text-[10px] font-bold text-aera-ink">{childCount} children</span>}
            <span className={clsx("rounded-full px-2.5 py-1 text-[10px] font-bold", item.isEnabled === false ? "bg-stone-100 text-stone-500" : "bg-emerald-50 text-emerald-700")}>
              {item.isEnabled === false ? "Hidden" : "Visible"}
            </span>
          </div>
        </button>
        <div className="flex flex-wrap items-center justify-end gap-1">
          <IconAction label="Move up" onClick={() => onMove(item.id, -1)} icon={<ArrowUp className="h-3.5 w-3.5" />} />
          <IconAction label="Move down" onClick={() => onMove(item.id, 1)} icon={<ArrowDown className="h-3.5 w-3.5" />} />
          <IconAction label="Outdent" onClick={() => onOutdent(item.id)} icon={<ArrowLeft className="h-3.5 w-3.5" />} />
          <IconAction label="Indent" onClick={() => onIndent(item.id)} icon={<ArrowRight className="h-3.5 w-3.5" />} />
          {canAddChild && <IconAction label="Add child" onClick={() => onAddChild(item.id)} icon={<Plus className="h-3.5 w-3.5" />} />}
          <IconAction label="Edit item" onClick={() => onSelect(item.id)} icon={<Pencil className="h-3.5 w-3.5" />} />
          <IconAction label="Duplicate item" onClick={() => onDuplicate(item.id)} icon={<Copy className="h-3.5 w-3.5" />} />
          <IconAction label={item.isEnabled === false ? "Show item" : "Hide item"} onClick={() => onToggleEnabled(item.id)} icon={item.isEnabled === false ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />} />
          <IconAction label="Delete item" onClick={() => onDelete(item.id)} danger icon={<Trash2 className="h-3.5 w-3.5" />} />
          <MoreHorizontal className="h-4 w-4 text-aera-muted/50" aria-hidden />
        </div>
      </div>
    </div>
  );
}

function IconAction({ label, icon, danger, onClick }: { label: string; icon: ReactNode; danger?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className={clsx(
        "flex h-9 w-9 items-center justify-center rounded-xl border border-transparent transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40",
        danger ? "text-red-500 hover:border-red-100 hover:bg-red-50" : "text-aera-muted hover:border-aera-champagne/50 hover:bg-aera-champagne/20 hover:text-aera-ink"
      )}
    >
      {icon}
    </button>
  );
}
