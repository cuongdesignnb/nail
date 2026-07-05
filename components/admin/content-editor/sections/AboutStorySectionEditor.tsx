'use client';

import { Plus, Trash2, ArrowUp, ArrowDown, GripVertical } from 'lucide-react';
import { MediaPickerField } from '@/components/admin/media/MediaPickerField';

type ImageField = {
  mediaId?: string | null;
  src: string;
  alt: string;
  title?: string | null;
};

type IconCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

type AboutStoryData = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  images: ImageField[];
  statCard: {
    value: string;
    label: string;
    icon: string;
  };
  highlights: IconCard[];
};

type Props = {
  data: AboutStoryData;
  onChange: (data: AboutStoryData) => void;
};

export function AboutStorySectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<AboutStoryData>) {
    onChange({ ...data, ...patch });
  }

  // Paragraphs handlers
  function updateParagraph(index: number, value: string) {
    const paragraphs = [...data.paragraphs];
    paragraphs[index] = value;
    update({ paragraphs });
  }

  function addParagraph() {
    update({ paragraphs: [...data.paragraphs, ''] });
  }

  function removeParagraph(index: number) {
    update({ paragraphs: data.paragraphs.filter((_, i) => i !== index) });
  }

  function moveParagraph(index: number, direction: 'up' | 'down') {
    const paragraphs = [...data.paragraphs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < paragraphs.length) {
      const temp = paragraphs[index];
      paragraphs[index] = paragraphs[targetIndex];
      paragraphs[targetIndex] = temp;
      update({ paragraphs });
    }
  }

  // Images handlers
  function updateImage(index: number, patch: Partial<ImageField>) {
    const images = [...data.images];
    images[index] = { ...images[index], ...patch };
    update({ images });
  }

  function addImage() {
    update({ images: [...data.images, { src: '', alt: '' }] });
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

  // Highlights handlers
  function updateHighlight(index: number, patch: Partial<IconCard>) {
    const highlights = [...data.highlights];
    highlights[index] = { ...highlights[index], ...patch };
    update({ highlights });
  }

  function addHighlight() {
    update({
      highlights: [
        ...data.highlights,
        { id: crypto.randomUUID(), icon: 'sparkles', title: '', description: '' },
      ],
    });
  }

  function removeHighlight(index: number) {
    update({ highlights: data.highlights.filter((_, i) => i !== index) });
  }

  function moveHighlight(index: number, direction: 'up' | 'down') {
    const highlights = [...data.highlights];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < highlights.length) {
      const temp = highlights[index];
      highlights[index] = highlights[targetIndex];
      highlights[targetIndex] = temp;
      update({ highlights });
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Eyebrow</label>
          <input
            type="text"
            value={data.eyebrow}
            onChange={(e) => update({ eyebrow: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      </div>

      {/* Paragraphs Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#23212a]">Paragraphs</label>
        {data.paragraphs.map((para, i) => (
          <div key={i} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg border border-gray-100">
            <div className="flex flex-col gap-1 mt-2">
              <button
                type="button"
                onClick={() => moveParagraph(i, 'up')}
                disabled={i === 0}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => moveParagraph(i, 'down')}
                disabled={i === data.paragraphs.length - 1}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
              >
                <ArrowDown size={14} />
              </button>
            </div>
            <div className="flex-1">
              <textarea
                value={para}
                onChange={(e) => updateParagraph(i, e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[80px]"
                placeholder={`Paragraph ${i + 1}`}
              />
            </div>
            <button
              type="button"
              onClick={() => removeParagraph(i)}
              className="text-red-500 hover:text-red-700 p-1 mt-2"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addParagraph}
          className="flex items-center gap-1 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition mt-1"
        >
          <Plus size={16} /> Add Paragraph
        </button>
      </div>

      {/* Images Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#23212a]">Story Images</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.images.map((img, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500">Image {i + 1}</span>
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
              <MediaPickerField
                label={`Image ${i + 1}`}
                value={img}
                alt={img.alt}
                onChange={(image) => updateImage(i, image ?? { mediaId: null, src: '', alt: '' })}
                onAltChange={(alt) => updateImage(i, { alt })}
                folder="about"
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addImage}
          className="flex items-center gap-1 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition mt-1"
        >
          <Plus size={16} /> Add Image
        </button>
      </div>

      {/* Stat Card */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
        <label className="block text-sm font-semibold text-[#23212a]">Stat Card</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#23212a] mb-1">Value</label>
            <input
              type="text"
              value={data.statCard.value}
              onChange={(e) => update({ statCard: { ...data.statCard, value: e.target.value } })}
              placeholder="e.g. 10+"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#23212a] mb-1">Label</label>
            <input
              type="text"
              value={data.statCard.label}
              onChange={(e) => update({ statCard: { ...data.statCard, label: e.target.value } })}
              placeholder="e.g. Years of Experience"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#23212a] mb-1">Icon</label>
            <input
              type="text"
              value={data.statCard.icon}
              onChange={(e) => update({ statCard: { ...data.statCard, icon: e.target.value } })}
              placeholder="e.g. award"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-[#23212a]">Highlights</label>
        {data.highlights.map((item, i) => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-[#23212a]">
                <GripVertical size={14} className="text-gray-400" />
                Highlight {i + 1}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveHighlight(i, 'up')}
                  disabled={i === 0}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => moveHighlight(i, 'down')}
                  disabled={i === data.highlights.length - 1}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => removeHighlight(i)}
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
                  value={item.title}
                  onChange={(e) => updateHighlight(i, { title: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#23212a] mb-1">Icon (Lucide name)</label>
                <input
                  type="text"
                  value={item.icon}
                  onChange={(e) => updateHighlight(i, { icon: e.target.value })}
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#23212a] mb-1">Description</label>
              <textarea
                value={item.description}
                onChange={(e) => updateHighlight(i, { description: e.target.value })}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[60px]"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addHighlight}
          className="flex items-center gap-1 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition mt-1"
        >
          <Plus size={16} /> Add Highlight
        </button>
      </div>
    </div>
  );
}
