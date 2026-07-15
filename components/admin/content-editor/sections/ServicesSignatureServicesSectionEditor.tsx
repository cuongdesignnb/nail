'use client';

import { ArrowDown, ArrowUp, GripVertical, Plus, Trash2 } from 'lucide-react';
import { MediaPickerField } from '@/components/admin/media/MediaPickerField';
import { asArray } from '@/lib/utils/array';

type ServiceFeature = string;

type ServiceItem = {
  id: string;
  categoryId?: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  price?: number | string;
  priceLabel?: string;
  durationMinutes?: number;
  durationLabel?: string;
  features?: ServiceFeature[];
  isFeatured?: boolean;
};

type Props = {
  data: ServiceItem[];
  onChange: (data: ServiceItem[]) => void;
};

export function ServicesSignatureServicesSectionEditor({ data = [], onChange }: Props) {
  const services = asArray<ServiceItem>(data).map((service) => ({
    ...service,
    id: typeof service.id === 'string' ? service.id : crypto.randomUUID(),
    name: typeof service.name === 'string' ? service.name : '',
    slug: typeof service.slug === 'string' ? service.slug : '',
    features: asArray<string>(service.features),
  }));

  function update(next: ServiceItem[]) {
    onChange(next);
  }

  function updateService(index: number, patch: Partial<ServiceItem>) {
    const next = [...services];
    next[index] = { ...next[index], ...patch };
    update(next);
  }

  function addService() {
    update([
      ...services,
      {
        id: crypto.randomUUID(),
        categoryId: '',
        name: '',
        slug: '',
        shortDescription: '',
        description: '',
        image: '',
        imageAlt: '',
        price: '',
        priceLabel: '',
        durationMinutes: 45,
        durationLabel: '45 min',
        features: [''],
        isFeatured: true,
      },
    ]);
  }

  function removeService(index: number) {
    update(services.filter((_, i) => i !== index));
  }

  function moveService(index: number, direction: 'up' | 'down') {
    const next = [...services];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.length) return;
    const current = next[index];
    next[index] = next[targetIndex];
    next[targetIndex] = current;
    update(next);
  }

  function updateFeature(serviceIndex: number, featureIndex: number, value: string) {
    const next = [...services];
    const features = [...(next[serviceIndex].features ?? [])];
    features[featureIndex] = value;
    next[serviceIndex] = { ...next[serviceIndex], features };
    update(next);
  }

  function addFeature(serviceIndex: number) {
    const next = [...services];
    next[serviceIndex] = {
      ...next[serviceIndex],
      features: [...(next[serviceIndex].features ?? []), ''],
    };
    update(next);
  }

  function removeFeature(serviceIndex: number, featureIndex: number) {
    const next = [...services];
    next[serviceIndex] = {
      ...next[serviceIndex],
      features: (next[serviceIndex].features ?? []).filter((_, i) => i !== featureIndex),
    };
    update(next);
  }

  return (
    <div className="space-y-4">
      {services.map((service, i) => (
        <div key={service.id} className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-[#23212a]">
              <GripVertical size={14} className="text-gray-400" />
              Service {i + 1}
            </div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => moveService(i, 'up')} disabled={i === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                <ArrowUp size={14} />
              </button>
              <button type="button" onClick={() => moveService(i, 'down')} disabled={i === services.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30">
                <ArrowDown size={14} />
              </button>
              <button type="button" onClick={() => removeService(i)} className="p-1 text-red-500 hover:text-red-700">
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <label className="space-y-1 text-xs font-medium text-[#23212a]">
              Name
              <input value={service.name} onChange={(e) => updateService(i, { name: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#B87D5B] focus:ring-2 focus:ring-[#B87D5B]/30" />
            </label>
            <label className="space-y-1 text-xs font-medium text-[#23212a]">
              Slug
              <input value={service.slug} onChange={(e) => updateService(i, { slug: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#B87D5B] focus:ring-2 focus:ring-[#B87D5B]/30" />
            </label>
            <label className="space-y-1 text-xs font-medium text-[#23212a]">
              Category ID
              <input value={service.categoryId ?? ''} onChange={(e) => updateService(i, { categoryId: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#B87D5B] focus:ring-2 focus:ring-[#B87D5B]/30" />
            </label>
          </div>

          <label className="block space-y-1 text-xs font-medium text-[#23212a]">
            Short Description
            <input value={service.shortDescription ?? ''} onChange={(e) => updateService(i, { shortDescription: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#B87D5B] focus:ring-2 focus:ring-[#B87D5B]/30" />
          </label>

          <label className="block space-y-1 text-xs font-medium text-[#23212a]">
            Description
            <textarea value={service.description ?? ''} onChange={(e) => updateService(i, { description: e.target.value })} className="min-h-[90px] w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#B87D5B] focus:ring-2 focus:ring-[#B87D5B]/30" />
          </label>

          <MediaPickerField
            valueMode="url"
            label="Service Image"
            value={service.image ?? ''}
            alt={service.imageAlt ?? ''}
            onChange={(src) => updateService(i, { image: src || "" })}
            onAltChange={(alt) => updateService(i, { imageAlt: alt })}
            folder="services"
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
            <label className="space-y-1 text-xs font-medium text-[#23212a]">
              Price
              <input value={service.price ?? ''} onChange={(e) => updateService(i, { price: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#B87D5B] focus:ring-2 focus:ring-[#B87D5B]/30" />
            </label>
            <label className="space-y-1 text-xs font-medium text-[#23212a]">
              Price Label
              <input value={service.priceLabel ?? ''} onChange={(e) => updateService(i, { priceLabel: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#B87D5B] focus:ring-2 focus:ring-[#B87D5B]/30" />
            </label>
            <label className="space-y-1 text-xs font-medium text-[#23212a]">
              Duration Minutes
              <input type="number" value={service.durationMinutes ?? 0} onChange={(e) => updateService(i, { durationMinutes: Number(e.target.value) })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#B87D5B] focus:ring-2 focus:ring-[#B87D5B]/30" />
            </label>
            <label className="space-y-1 text-xs font-medium text-[#23212a]">
              Duration Label
              <input value={service.durationLabel ?? ''} onChange={(e) => updateService(i, { durationLabel: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#B87D5B] focus:ring-2 focus:ring-[#B87D5B]/30" />
            </label>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-[#23212a]">
            <input type="checkbox" checked={!!service.isFeatured} onChange={(e) => updateService(i, { isFeatured: e.target.checked })} />
            Featured on public services page
          </label>

          <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-3">
            <span className="block text-xs font-semibold text-gray-500">Features</span>
            {(service.features ?? []).map((feature, featureIndex) => (
              <div key={featureIndex} className="flex items-center gap-2">
                <input value={feature} onChange={(e) => updateFeature(i, featureIndex, e.target.value)} className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-[#B87D5B]" />
                <button type="button" onClick={() => removeFeature(i, featureIndex)} className="p-1 text-red-500 hover:text-red-700">
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
            <button type="button" onClick={() => addFeature(i)} className="inline-flex items-center gap-1 text-xs font-medium text-[#B87D5B] hover:text-[#a06b4a]">
              <Plus size={14} /> Add Feature
            </button>
          </div>
        </div>
      ))}

      <button type="button" onClick={addService} className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a]">
        <Plus size={16} /> Add Service
      </button>
    </div>
  );
}
