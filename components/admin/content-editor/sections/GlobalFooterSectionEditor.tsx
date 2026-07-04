'use client';

import { Plus, Trash2, GripVertical } from 'lucide-react';

type LinkItem = { id: string; label: string; href: string };
type FooterData = {
  brandText: string;
  quickLinks: LinkItem[];
  serviceLinks: LinkItem[];
  contact: { phone: string; email: string; address: string; hours: string };
  newsletter: { title: string; description: string; placeholder: string };
  copyright: string;
};

type Props = { data: FooterData; onChange: (data: FooterData) => void };

export function GlobalFooterSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<FooterData>) {
    onChange({ ...data, ...patch });
  }

  function updateLinkList(key: 'quickLinks' | 'serviceLinks', index: number, patch: Partial<LinkItem>) {
    const links = [...data[key]];
    links[index] = { ...links[index], ...patch };
    update({ [key]: links });
  }

  function addLink(key: 'quickLinks' | 'serviceLinks') {
    update({ [key]: [...data[key], { id: crypto.randomUUID(), label: '', href: '' }] });
  }

  function removeLink(key: 'quickLinks' | 'serviceLinks', index: number) {
    update({ [key]: data[key].filter((_, i) => i !== index) });
  }

  function renderLinkList(key: 'quickLinks' | 'serviceLinks', title: string) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-[#23212a]">{title}</p>
        {data[key].map((item, i) => (
          <div key={item.id} className="flex items-center gap-2">
            <GripVertical size={14} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={item.label}
              onChange={(e) => updateLinkList(key, i, { label: e.target.value })}
              placeholder="Label"
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
            <input
              type="text"
              value={item.href}
              onChange={(e) => updateLinkList(key, i, { href: e.target.value })}
              placeholder="/path"
              className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
            <button onClick={() => removeLink(key, i)} className="text-red-500 hover:text-red-700 p-1 shrink-0">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        <button
          onClick={() => addLink(key)}
          className="flex items-center gap-2 text-sm font-medium text-[#B87D5B] hover:text-[#a06b4a] transition"
        >
          <Plus size={16} /> Add Link
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Brand Text</label>
        <textarea
          value={data.brandText}
          onChange={(e) => update({ brandText: e.target.value })}
          placeholder="Short footer brand description"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[100px]"
        />
      </div>

      {renderLinkList('quickLinks', 'Quick Links')}
      {renderLinkList('serviceLinks', 'Service Links')}

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-[#23212a]">Contact Info</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#23212a] mb-1">Phone</label>
            <input
              type="text"
              value={data.contact?.phone ?? ''}
              onChange={(e) => update({ contact: { ...data.contact, phone: e.target.value } })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#23212a] mb-1">Email</label>
            <input
              type="text"
              value={data.contact?.email ?? ''}
              onChange={(e) => update({ contact: { ...data.contact, email: e.target.value } })}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Address</label>
          <input
            type="text"
            value={data.contact?.address ?? ''}
            onChange={(e) => update({ contact: { ...data.contact, address: e.target.value } })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Hours</label>
          <input
            type="text"
            value={data.contact?.hours ?? ''}
            onChange={(e) => update({ contact: { ...data.contact, hours: e.target.value } })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-[#23212a]">Newsletter</p>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
          <input
            type="text"
            value={data.newsletter?.title ?? ''}
            onChange={(e) => update({ newsletter: { ...data.newsletter, title: e.target.value } })}
            placeholder="Stay Updated"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Description</label>
          <input
            type="text"
            value={data.newsletter?.description ?? ''}
            onChange={(e) => update({ newsletter: { ...data.newsletter, description: e.target.value } })}
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Placeholder</label>
          <input
            type="text"
            value={data.newsletter?.placeholder ?? ''}
            onChange={(e) => update({ newsletter: { ...data.newsletter, placeholder: e.target.value } })}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Copyright</label>
        <input
          type="text"
          value={data.copyright}
          onChange={(e) => update({ copyright: e.target.value })}
          placeholder="© 2025 Aera Nail Lounge. All rights reserved."
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>
    </div>
  );
}
