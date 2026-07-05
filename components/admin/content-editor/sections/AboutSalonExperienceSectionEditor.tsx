'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { MediaPickerField } from '@/components/admin/media/MediaPickerField';

type GalleryImage = {
  id: string;
  image: { mediaId?: string | null; src: string; alt: string; title?: string | null };
  title?: string;
};

type SalonExperienceData = {
  eyebrow: string;
  images: GalleryImage[];
};

type Props = {
  data: SalonExperienceData;
  onChange: (data: SalonExperienceData) => void;
};

export function AboutSalonExperienceSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<SalonExperienceData>) {
    onChange({ ...data, ...patch });
  }

  function updateImageItem(index: number, patch: Partial<GalleryImage>) {
    const images = [...data.images];
    images[index] = { ...images[index], ...patch };
    update({ images });
  }

  function updateImageConfig(index: number, imagePatch: Partial<GalleryImage['image']>) {
    const images = [...data.images];
    const imageConfig = images[index].image || { src: '', alt: '' };
    images[index] = {
      ...images[index],
      image: { ...imageConfig, ...imagePatch },
    };
    update({ images });
  }

  function addImage() {
    update({
      images: [
        ...data.images,
        {
          id: crypto.randomUUID(),
          image: { src: '', alt: '' },
          title: '',
        },
      ],
    });
  }

  function removeImage(index: number) {
    update({ images: data.images.filter((_, i) => i !== index) });
  }

  function moveImage(index: number, direction: 'up' | 'down') {
    const images = [...data.images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < images.length) {
      const temp = images[index];
      images[index] = images[targetIndex];
      images[targetIndex] = temp;
      update({ images });
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Eyebrow</label>
        <input
          type="text"
          value={data.eyebrow}
          onChange={(e) => update({ eyebrow: e.target.value })}
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#23212a]">Experience Gallery</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.images.map((item, i) => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                  <GripVertical size={14} className="text-gray-400" />
                  Image {i + 1}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveImage(i, 'up')}
                    disabled={i === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(i, 'down')}
                    disabled={i === data.images.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="text-red-500 hover:text-red-700 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Title (Optional)</label>
                <input
                  type="text"
                  value={item.title ?? ''}
                  onChange={(e) => updateImageItem(i, { title: e.target.value })}
                  placeholder="e.g. Cozy Lounge Interior"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>

              <MediaPickerField
                label="Gallery Image"
                value={item.image ?? null}
                alt={item.image?.alt ?? ''}
                onChange={(image) => updateImageItem(i, { image: image ?? { mediaId: null, src: '', alt: '' } })}
                onAltChange={(alt) => updateImageConfig(i, { alt })}
                folder="salon-experience"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={addImage}
        className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
      >
        <Plus size={16} /> Add Gallery Image
      </button>
    </div>
  );
}
