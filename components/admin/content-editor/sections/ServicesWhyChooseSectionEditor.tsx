'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { MediaPickerField } from '@/components/admin/media/MediaPickerField';
import { asArray, isRecord } from '@/lib/utils/array';

type IconCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

type WhyChooseData = {
  title: string;
  description: string;
  image: { mediaId?: string | null; src: string; alt: string; title?: string | null };
  features: IconCard[];
};

type Props = {
  data: WhyChooseData;
  onChange: (data: WhyChooseData) => void;
};

export function ServicesWhyChooseSectionEditor({ data, onChange }: Props) {
  const safeData: WhyChooseData = {
    title: isRecord(data) && typeof data.title === 'string' ? data.title : '',
    description: isRecord(data) && typeof data.description === 'string' ? data.description : '',
    image:
      isRecord(data) && isRecord(data.image)
        ? {
            mediaId: typeof data.image.mediaId === 'string' ? data.image.mediaId : null,
            src: typeof data.image.src === 'string' ? data.image.src : '',
            alt: typeof data.image.alt === 'string' ? data.image.alt : '',
            title: typeof data.image.title === 'string' ? data.image.title : null,
          }
        : { mediaId: null, src: '', alt: '' },
    features: asArray<IconCard>(isRecord(data) ? data.features : []),
  };

  function update(patch: Partial<WhyChooseData>) {
    onChange({ ...safeData, ...patch });
  }

  function updateFeature(index: number, patch: Partial<IconCard>) {
    const features = [...safeData.features];
    features[index] = { ...features[index], ...patch };
    update({ features });
  }

  function addFeature() {
    update({
      features: [
        ...safeData.features,
        { id: crypto.randomUUID(), icon: 'check', title: '', description: '' },
      ],
    });
  }

  function removeFeature(index: number) {
    update({ features: safeData.features.filter((_, i) => i !== index) });
  }

  function moveFeature(index: number, direction: 'up' | 'down') {
    const features = [...safeData.features];
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
        <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
        <input
          type="text"
          value={safeData.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Description</label>
        <textarea
          value={safeData.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[100px]"
        />
      </div>

      <MediaPickerField
        label="Cover Image"
        value={safeData.image ?? null}
        alt={safeData.image?.alt ?? ''}
        onChange={(image) => update({ image: image ?? { mediaId: null, src: '', alt: '' } })}
        onAltChange={(alt) => update({ image: { ...safeData.image, alt } })}
        folder="services"
      />

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#23212a]">Why Choose Features</label>
        {safeData.features.map((feature, i) => (
          <div key={feature.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
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
                  disabled={i === safeData.features.length - 1}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Title</label>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) => updateFeature(i, { title: e.target.value })}
                  placeholder="e.g. Certified Professionals"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Icon (Lucide name)</label>
                <input
                  type="text"
                  value={feature.icon}
                  onChange={(e) => updateFeature(i, { icon: e.target.value })}
                  placeholder="e.g. shield"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#23212a] mb-1">Description</label>
              <textarea
                value={feature.description}
                onChange={(e) => updateFeature(i, { description: e.target.value })}
                placeholder="Feature description..."
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[60px]"
              />
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
