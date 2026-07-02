"use client";

import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

export function RepeaterField<T extends { id?: string }>({
  title,
  items,
  createItem,
  onChange,
  renderItem
}: {
  title: string;
  items: T[];
  createItem: () => T;
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (item: T) => void) => React.ReactNode;
}) {
  function move(index: number, direction: -1 | 1) {
    const next = [...items];
    const target = index + direction;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="repeater-field">
      <div className="repeater-heading">
        <h4>{title}</h4>
        <button type="button" onClick={() => onChange([...items, createItem()])}><Plus size={15} /> Add</button>
      </div>
      {items.map((item, index) => (
        <div className="repeater-item" key={item.id ?? index}>
          {renderItem(item, index, (updated) => onChange(items.map((current, currentIndex) => currentIndex === index ? updated : current)))}
          <div className="repeater-actions">
            <button type="button" onClick={() => move(index, -1)}><ArrowUp size={14} /> Move Up</button>
            <button type="button" onClick={() => move(index, 1)}><ArrowDown size={14} /> Move Down</button>
            <button type="button" onClick={() => onChange(items.filter((_, currentIndex) => currentIndex !== index))}><Trash2 size={14} /> Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
