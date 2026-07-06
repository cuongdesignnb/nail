"use client";

import { ChevronDown, ChevronRight, CornerDownRight, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import type { FlatMenuItem } from "./menu-tree.utils";
import { MenuActionMenu } from "./MenuActionMenu";

type MenuTreeItemProps = {
  item: FlatMenuItem;
  selected: boolean;
  expanded: boolean;
  canAddChild: boolean;
  canIndent: boolean;
  canOutdent: boolean;
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
  canIndent,
  canOutdent,
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
  const destination = item.type === "none" ? "Submenu only" : item.href || "Needs destination";

  return (
    <div
      ref={setNodeRef}
      style={style}
      role="treeitem"
      aria-selected={selected}
      aria-level={item.depth}
      className={clsx(
        "relative rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--admin-accent)]/30 hover:bg-[var(--admin-surface-muted)] hover:shadow-md",
        selected ? "border-[var(--admin-accent)] bg-[var(--admin-accent)]/10 shadow-md before:absolute before:inset-y-3 before:left-0 before:w-1 before:rounded-r-full before:bg-[var(--admin-accent)]" : "border-[var(--admin-border)]/45",
        item.isEnabled === false && "opacity-65",
        isDragging && "opacity-40"
      )}
    >
      <div className="grid min-h-[72px] grid-cols-[auto_auto_minmax(0,1fr)_auto_auto] items-center gap-2 px-3 py-2" style={{ paddingLeft: `${12 + (item.depth - 1) * 22}px` }}>
        <button
          type="button"
          aria-label={`Drag ${item.label || "menu item"}`}
          className="flex h-10 w-8 items-center justify-center rounded-xl text-[var(--admin-muted)] hover:bg-[var(--admin-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label={expanded ? "Collapse submenu" : "Expand submenu"}
          aria-expanded={expanded}
          onClick={(event) => {
            event.stopPropagation();
            onToggleExpanded(item.id);
          }}
          className="flex h-10 w-9 items-center justify-center rounded-xl text-[var(--admin-muted)] hover:bg-[var(--admin-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40"
        >
          {childCount ? expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" /> : item.depth > 1 ? <CornerDownRight className="h-4 w-4 opacity-40" /> : <span className="h-4 w-4" />}
        </button>
        <button type="button" onClick={() => onSelect(item.id)} className="min-w-0 text-left focus-visible:outline-none">
          <span className="block truncate text-[15px] font-bold leading-5 text-[var(--admin-ink)]">{item.label || "Untitled Link"}</span>
          <span className="mt-1 block min-w-0 truncate text-xs leading-4 text-[var(--admin-muted)]">{destination}</span>
        </button>
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          {childCount > 0 && <span className="rounded-full bg-[var(--admin-surface-muted)] px-2.5 py-1 text-[10px] font-bold text-[var(--admin-ink)]">{childCount} items</span>}
          <span className={clsx("rounded-full px-2.5 py-1 text-[10px] font-bold", item.isEnabled === false ? "bg-stone-100 text-stone-500" : "bg-emerald-50 text-emerald-700")}>
            {item.isEnabled === false ? "Hidden" : "Visible"}
          </span>
        </div>
        <MenuActionMenu
          hidden={item.isEnabled === false}
          canAddChild={canAddChild}
          canIndent={canIndent}
          canOutdent={canOutdent}
          onEdit={() => onSelect(item.id)}
          onAddChild={() => onAddChild(item.id)}
          onDuplicate={() => onDuplicate(item.id)}
          onMoveUp={() => onMove(item.id, -1)}
          onMoveDown={() => onMove(item.id, 1)}
          onIndent={() => onIndent(item.id)}
          onOutdent={() => onOutdent(item.id)}
          onToggleEnabled={() => onToggleEnabled(item.id)}
          onDelete={() => onDelete(item.id)}
        />
      </div>
    </div>
  );
}
