'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';

type ComparisonColumn = {
  key: string;
  label: string;
  priceLabel: string;
};

type ComparisonFeature = {
  id: string;
  featureName: string;
  essentialValue?: string;
  signatureValue?: string;
  premiumValue?: string;
  vipValue?: string;
  [key: string]: string | undefined;
};

type ComparisonData = {
  title: string;
  columns: ComparisonColumn[];
  features: ComparisonFeature[];
};

type Props = {
  data: ComparisonData;
  onChange: (data: ComparisonData) => void;
};

export function PackagesComparisonSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<ComparisonData>) {
    onChange({ ...data, ...patch });
  }

  // Columns handlers
  function updateColumn(index: number, patch: Partial<ComparisonColumn>) {
    const columns = [...data.columns];
    columns[index] = { ...columns[index], ...patch };
    update({ columns });
  }

  function addColumn() {
    const nextKey = `col-${crypto.randomUUID().slice(0, 8)}`;
    update({
      columns: [...data.columns, { key: nextKey, label: '', priceLabel: '' }],
    });
  }

  function removeColumn(index: number) {
    const colKey = data.columns[index].key;
    const columns = data.columns.filter((_, i) => i !== index);
    // Clean up key from all features
    const features = data.features.map((feat) => {
      const copy = { ...feat };
      delete copy[colKey];
      return copy;
    });
    update({ columns, features });
  }

  function moveColumn(index: number, direction: 'up' | 'down') {
    const columns = [...data.columns];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < columns.length) {
      const temp = columns[index];
      columns[index] = columns[targetIndex];
      columns[targetIndex] = temp;
      update({ columns });
    }
  }

  // Features handlers
  function updateFeature(index: number, patch: Partial<ComparisonFeature>) {
    const features = [...data.features];
    features[index] = { ...features[index], ...patch };
    update({ features });
  }

  function addFeature() {
    update({
      features: [...data.features, { id: crypto.randomUUID(), featureName: '' }],
    });
  }

  function removeFeature(index: number) {
    update({ features: data.features.filter((_, i) => i !== index) });
  }

  function moveFeature(index: number, direction: 'up' | 'down') {
    const features = [...data.features];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < features.length) {
      const temp = features[index];
      features[index] = features[targetIndex];
      features[targetIndex] = temp;
      update({ features });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Section Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      {/* Columns management */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#23212a]">Comparison Columns</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.columns.map((col, i) => (
            <div key={col.key} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200 relative">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-500">Column {i + 1}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveColumn(i, 'up')}
                    disabled={i === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveColumn(i, 'down')}
                    disabled={i === data.columns.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeColumn(i)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#23212a] mb-1">Label</label>
                  <input
                    type="text"
                    value={col.label}
                    onChange={(e) => updateColumn(i, { label: e.target.value })}
                    placeholder="e.g. Essential Care"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#23212a] mb-1">Price Label</label>
                  <input
                    type="text"
                    value={col.priceLabel}
                    onChange={(e) => updateColumn(i, { priceLabel: e.target.value })}
                    placeholder="e.g. $65"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addColumn}
          className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
        >
          <Plus size={16} /> Add Column
        </button>
      </div>

      {/* Features management */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#23212a]">Comparison Features</label>
        {data.features.map((feature, i) => (
          <div key={feature.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Feature {i + 1}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveFeature(i, 'up')}
                  disabled={i === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveFeature(i, 'down')}
                  disabled={i === data.features.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeFeature(i)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#23212a] mb-1">Feature Name</label>
              <input
                type="text"
                value={feature.featureName}
                onChange={(e) => updateFeature(i, { featureName: e.target.value })}
                placeholder="e.g. Hand Massage"
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
              />
            </div>

            {/* Dynamic Column Values */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white p-3 rounded-lg border border-gray-150">
              {data.columns.map((col) => (
                <div key={col.key}>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1">{col.label || col.key}</label>
                  <input
                    type="text"
                    value={feature[col.key] ?? ''}
                    onChange={(e) => updateFeature(i, { [col.key]: e.target.value })}
                    placeholder="e.g. check or -"
                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addFeature}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add Feature
      </button>
    </div>
  );
}
