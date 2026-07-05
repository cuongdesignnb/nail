'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-semibold text-[#23212a]">Footer Menus: Company, Services, Explore, Legal and Social</p>
        <p className="mt-1 text-sm text-gray-600">Menu trees are managed in Menu Manager. Content Hub keeps footer description, contact, newsletter and copyright content.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/menus" className="inline-flex items-center gap-2 rounded-full bg-[#23212a] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
            <Menu size={14} /> Manage Menu Items
          </Link>
          <Link href="/admin/menus/settings" className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#23212a]">
            Footer Layout Settings
          </Link>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Brand Text</label>
        <textarea
          value={data.brandText}
          onChange={(e) => update({ brandText: e.target.value })}
          placeholder="Short footer brand description"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[100px]"
        />
      </div>

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
