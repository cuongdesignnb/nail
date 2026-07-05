'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { asArray } from '@/lib/utils/array';

type PackageItem = {
  id: string;
  name: string;
  subtitle?: string;
  price?: string;
  priceLabel?: string;
  badge?: string;
  features: string[];
};

type Props = {
  data: PackageItem[];
  onChange: (data: PackageItem[]) => void;
};

export function ServicesFeaturedPackagesSectionEditor({ data = [], onChange }: Props) {
  const packages = asArray<PackageItem>(data).map((pkg) => ({
    ...pkg,
    features: asArray<string>(pkg.features),
  }));

  function update(newData: PackageItem[]) {
    onChange(newData);
  }

  function updatePackage(index: number, patch: Partial<PackageItem>) {
    const items = [...packages];
    items[index] = { ...items[index], ...patch };
    update(items);
  }

  function addPackage() {
    update([
      ...packages,
      {
        id: crypto.randomUUID(),
        name: '',
        subtitle: '',
        price: '',
        priceLabel: '',
        badge: '',
        features: [''],
      },
    ]);
  }

  function removePackage(index: number) {
    update(packages.filter((_, i) => i !== index));
  }

  function movePackage(index: number, direction: 'up' | 'down') {
    const items = [...packages];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < items.length) {
      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;
      update(items);
    }
  }

  // Nested Features
  function updateFeature(pkgIdx: number, featIdx: number, value: string) {
    const items = [...packages];
    const features = [...items[pkgIdx].features];
    features[featIdx] = value;
    items[pkgIdx] = { ...items[pkgIdx], features };
    update(items);
  }

  function addFeature(pkgIdx: number) {
    const items = [...packages];
    const features = [...items[pkgIdx].features, ''];
    items[pkgIdx] = { ...items[pkgIdx], features };
    update(items);
  }

  function removeFeature(pkgIdx: number, featIdx: number) {
    const items = [...packages];
    const features = items[pkgIdx].features.filter((_, i) => i !== featIdx);
    items[pkgIdx] = { ...items[pkgIdx], features };
    update(items);
  }

  function moveFeature(pkgIdx: number, featIdx: number, direction: 'up' | 'down') {
    const items = [...packages];
    const features = [...items[pkgIdx].features];
    const targetIndex = direction === 'up' ? featIdx - 1 : featIdx + 1;
    if (targetIndex >= 0 && targetIndex < features.length) {
      const temp = features[featIdx];
      features[featIdx] = features[targetIndex];
      features[targetIndex] = temp;
      items[pkgIdx] = { ...items[pkgIdx], features };
      update(items);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {packages.map((pkg, i) => (
          <div key={pkg.id} className="bg-gray-50 rounded-lg p-4 space-y-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Package {i + 1}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => movePackage(i, 'up')}
                  disabled={i === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => movePackage(i, 'down')}
                  disabled={i === packages.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removePackage(i)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Package Name</label>
                <input
                  type="text"
                  value={pkg.name}
                  onChange={(e) => updatePackage(i, { name: e.target.value })}
                  placeholder="e.g. Signature Mani-Pedi"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Subtitle (Optional)</label>
                <input
                  type="text"
                  value={pkg.subtitle ?? ''}
                  onChange={(e) => updatePackage(i, { subtitle: e.target.value })}
                  placeholder="e.g. Perfect for a quick refresh"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Price (Optional)</label>
                <input
                  type="text"
                  value={pkg.price ?? ''}
                  onChange={(e) => updatePackage(i, { price: e.target.value })}
                  placeholder="e.g. 75"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Price Label (Optional)</label>
                <input
                  type="text"
                  value={pkg.priceLabel ?? ''}
                  onChange={(e) => updatePackage(i, { priceLabel: e.target.value })}
                  placeholder="e.g. Package Value"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Badge (Optional)</label>
                <input
                  type="text"
                  value={pkg.badge ?? ''}
                  onChange={(e) => updatePackage(i, { badge: e.target.value })}
                  placeholder="e.g. Best Value, Popular"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>

            {/* Features (strings array) */}
            <div className="bg-white p-4 rounded-lg border border-gray-150 space-y-3">
              <span className="block text-xs font-semibold text-gray-500">Package Features</span>
              {pkg.features.map((feat, featIdx) => (
                <div key={featIdx} className="flex gap-2 items-center">
                  <div className="flex flex-col gap-0.5">
                    <button
                      type="button"
                      onClick={() => moveFeature(i, featIdx, 'up')}
                      disabled={featIdx === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ArrowUp size={11} />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveFeature(i, featIdx, 'down')}
                      disabled={featIdx === pkg.features.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <ArrowDown size={11} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => updateFeature(i, featIdx, e.target.value)}
                    placeholder="e.g. Relaxing hand massage"
                    className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(i, featIdx)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addFeature(i)}
                className="flex items-center gap-1 text-xs font-medium text-[#B87D5B] hover:text-[#a06b4a] transition mt-2"
              >
                <Plus size={14} /> Add Feature Line
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addPackage}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add Package
      </button>
    </div>
  );
}
