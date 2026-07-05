"use client";

import { useMemo, useState } from "react";
import { closestCenter, DndContext, DragOverlay, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { ListTree, Plus } from "lucide-react";
import type { NavigationLocation, NavigationMenuItem } from "@/lib/navigation/navigation.types";
import { AdminEmptyState } from "@/components/admin/ui";
import { MenuDragOverlay } from "./MenuDragOverlay";
import { MenuTreeItem } from "./MenuTreeItem";
import {
  addMenuItem,
  deleteMenuItem,
  duplicateMenuItem,
  findMenuItem,
  flattenMenuItems,
  indentMenuItem,
  maxDepthByLocation,
  moveMenuItem,
  outdentMenuItem,
  reorderFlatMenu,
  updateMenuItem,
} from "./menu-tree.utils";

type MenuTreeProps = {
  items: NavigationMenuItem[];
  location: NavigationLocation;
  selectedId: string | null;
  onChange: (items: NavigationMenuItem[]) => void;
  onSelect: (id: string | null) => void;
  onRequestDelete: (id: string) => void;
};

export function MenuTree({ items, location, selectedId, onChange, onSelect, onRequestDelete }: MenuTreeProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(flattenMenuItems(items).map((item) => item.id)));
  const [activeId, setActiveId] = useState<string | null>(null);
  const flatItems = useMemo(() => flattenMenuItems(items).filter((item) => isVisibleByExpansion(item, expanded, items)), [items, expanded]);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const activeItem = activeId ? findMenuItem(items, activeId) : null;
  const noChildren = location === "footer_legal" || location === "footer_social";

  function addRootItem() {
    const next = addMenuItem(items, location);
    onChange(next);
    const added = next[next.length - 1];
    onSelect(added?.id || null);
  }

  function addChild(parentId: string) {
    const parent = flatItems.find((item) => item.id === parentId);
    if (!parent || parent.depth >= maxDepthByLocation[location] || noChildren) return;
    const next = addMenuItem(items, location, parentId);
    onChange(next);
    setExpanded((prev) => new Set(prev).add(parentId));
  }

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);
    const active = String(event.active.id);
    const over = event.over?.id ? String(event.over.id) : "";
    if (!over || active === over) return;
    onChange(reorderFlatMenu(items, active, over));
  }

  return (
    <section className="rounded-[22px] border border-aera-champagne/40 bg-white/95 p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl text-aera-ink">Menu Items</h2>
          <p className="text-xs text-aera-muted">Drag to reorder. Select an item to edit its destination.</p>
        </div>
        <button
          type="button"
          onClick={addRootItem}
          className="inline-flex min-h-11 items-center gap-2 rounded-full bg-aera-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-aera-accentHover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40"
        >
          <Plus className="h-4 w-4" />
          Add Menu Item
        </button>
      </div>

      {!items.length ? (
        <AdminEmptyState
          icon={ListTree}
          title="No menu items yet."
          description="Add your first link to begin building this menu."
          actionLabel="Add Item"
          onAction={addRootItem}
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <SortableContext items={flatItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2" role="tree" aria-label="Menu structure">
              {flatItems.map((item) => (
                <MenuTreeItem
                  key={item.id}
                  item={item}
                  selected={item.id === selectedId}
                  expanded={expanded.has(item.id)}
                  canAddChild={!noChildren && item.depth < maxDepthByLocation[location]}
                  canIndent={!noChildren && item.depth < maxDepthByLocation[location] && item.index > 0}
                  canOutdent={item.depth > 1}
                  onSelect={onSelect}
                  onToggleExpanded={toggleExpanded}
                  onAddChild={addChild}
                  onDuplicate={(id) => onChange(duplicateMenuItem(items, id))}
                  onToggleEnabled={(id) => onChange(updateMenuItem(items, id, { isEnabled: findMenuItem(items, id)?.isEnabled === false }))}
                  onDelete={onRequestDelete}
                  onMove={(id, direction) => onChange(moveMenuItem(items, id, direction))}
                  onIndent={(id) => onChange(indentMenuItem(items, id, location))}
                  onOutdent={(id) => onChange(outdentMenuItem(items, id))}
                />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            <MenuDragOverlay item={activeItem} />
          </DragOverlay>
        </DndContext>
      )}
    </section>
  );
}

function isVisibleByExpansion(item: { parentId: string | null }, expanded: Set<string>, roots: NavigationMenuItem[]) {
  if (!item.parentId) return true;
  const parents = new Map<string, string | null>();
  flattenMenuItems(roots).forEach((node) => parents.set(node.id, node.parentId));
  let parentId: string | null = item.parentId;
  while (parentId) {
    if (!expanded.has(parentId)) return false;
    parentId = parents.get(parentId) || null;
  }
  return true;
}
