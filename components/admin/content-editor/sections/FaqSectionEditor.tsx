'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';
import { asArray, isRecord } from '@/lib/utils/array';

type FaqItem = { id: string; question: string; answer: string };
type FaqData = { title: string; eyebrow?: string; items: FaqItem[] };
type Props = { data: FaqData; onChange: (data: FaqData) => void };

export function FaqSectionEditor({ data, onChange }: Props) {
  const isArrayMode = Array.isArray(data);
  const safeData: FaqData = {
    title: isRecord(data) && typeof data.title === 'string' ? data.title : '',
    eyebrow: isRecord(data) && typeof data.eyebrow === 'string' ? data.eyebrow : undefined,
    items: asArray<FaqItem>(isArrayMode ? data : isRecord(data) ? data.items : []).map((item) => ({
      id: typeof item.id === 'string' ? item.id : crypto.randomUUID(),
      question: typeof item.question === 'string' ? item.question : '',
      answer: typeof item.answer === 'string' ? item.answer : '',
    })),
  };

  function emit(next: FaqData) {
    onChange((isArrayMode ? next.items : next) as FaqData);
  }

  function update(patch: Partial<FaqData>) {
    emit({ ...safeData, ...patch });
  }

  function updateItem(index: number, patch: Partial<FaqItem>) {
    const items = [...safeData.items];
    items[index] = { ...items[index], ...patch };
    update({ items });
  }

  function addItem() {
    update({ items: [...safeData.items, { id: crypto.randomUUID(), question: '', answer: '' }] });
  }

  function removeItem(index: number) {
    update({ items: safeData.items.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-4">
      {!isArrayMode && safeData.eyebrow !== undefined && (
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Eyebrow</label>
          <input
            type="text"
            value={safeData.eyebrow ?? ''}
            onChange={(e) => update({ eyebrow: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      )}

      {!isArrayMode && (
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
          <input
            type="text"
            value={safeData.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder="Frequently Asked Questions"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      )}

      <div className="space-y-3">
        {safeData.items.map((item, i) => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                FAQ {i + 1}
              </div>
              <button onClick={() => removeItem(i)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 size={14} />
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#23212a] mb-1">Question</label>
              <input
                type="text"
                value={item.question}
                onChange={(e) => updateItem(i, { question: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#23212a] mb-1">Answer</label>
              <textarea
                value={item.answer}
                onChange={(e) => updateItem(i, { answer: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[100px]"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add FAQ Item
      </button>
    </div>
  );
}
