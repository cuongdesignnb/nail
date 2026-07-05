'use client';

import { Image as ImageIcon } from 'lucide-react';
import { MediaPickerField } from '@/components/admin/media/MediaPickerField';
import type { HeroFields } from '@/lib/content/content.types';

type Props = {
  data: HeroFields;
  onChange: (updated: HeroFields) => void;
};

export function HeroSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<HeroFields>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div className="space-y-6">
      {/* Text fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Eyebrow</label>
          <input
            type="text"
            value={data.eyebrow}
            onChange={(e) => update({ eyebrow: e.target.value })}
            placeholder="e.g. Welcome to Aera Nail Lounge"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-pink-400 focus:ring-1 focus:ring-pink-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700 mb-1">Highlight Word</label>
          <input
            type="text"
            value={data.highlight}
            onChange={(e) => update({ highlight: e.target.value })}
            placeholder="Word to highlight in the title"
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-pink-400 focus:ring-1 focus:ring-pink-400 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Hero heading"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-pink-400 focus:ring-1 focus:ring-pink-400 outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          rows={3}
          placeholder="Short hero description"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-pink-400 focus:ring-1 focus:ring-pink-400 outline-none resize-y"
        />
      </div>

      {/* Hero Image */}
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">
          <ImageIcon size={14} className="inline mr-1" />
          Hero Image
        </label>
        <MediaPickerField
          label="Hero Image"
          value={data.image ?? null}
          alt={data.image?.alt ?? ''}
          onChange={(image) => update({ image: image ?? { mediaId: null, src: '', alt: '' } })}
          onAltChange={(alt) => update({ image: { ...data.image, alt } })}
          folder="heroes"
          aspectRatio="16/9"
        />
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <fieldset className="space-y-3 rounded-lg border border-zinc-200 p-4">
          <legend className="text-sm font-medium text-zinc-700 px-1">Primary Button</legend>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Label</label>
            <input
              type="text"
              value={data.primaryButton?.label ?? ''}
              onChange={(e) => update({ primaryButton: { ...data.primaryButton, label: e.target.value } })}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-pink-400 focus:ring-1 focus:ring-pink-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Link (href)</label>
            <input
              type="text"
              value={data.primaryButton?.href ?? ''}
              onChange={(e) => update({ primaryButton: { ...data.primaryButton, href: e.target.value } })}
              placeholder="/booking"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-pink-400 focus:ring-1 focus:ring-pink-400 outline-none"
            />
          </div>
        </fieldset>

        <fieldset className="space-y-3 rounded-lg border border-zinc-200 p-4">
          <legend className="text-sm font-medium text-zinc-700 px-1">Secondary Button</legend>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Label</label>
            <input
              type="text"
              value={data.secondaryButton?.label ?? ''}
              onChange={(e) => update({ secondaryButton: { ...data.secondaryButton, label: e.target.value } })}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-pink-400 focus:ring-1 focus:ring-pink-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Link (href)</label>
            <input
              type="text"
              value={data.secondaryButton?.href ?? ''}
              onChange={(e) => update({ secondaryButton: { ...data.secondaryButton, href: e.target.value } })}
              placeholder="/services"
              className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm focus:border-pink-400 focus:ring-1 focus:ring-pink-400 outline-none"
            />
          </div>
        </fieldset>
      </div>
    </div>
  );
}
