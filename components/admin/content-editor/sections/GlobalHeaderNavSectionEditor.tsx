'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

type NavItem = { id: string; label: string; href: string };
type HeaderNavData = {
  items: NavItem[];
  cta: { label: string; href: string };
};

type Props = { data: HeaderNavData; onChange: (data: HeaderNavData) => void };

export function GlobalHeaderNavSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<HeaderNavData>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm font-semibold text-[#23212a]">Primary Menu: Header Primary Navigation</p>
        <p className="mt-1 text-sm text-gray-600">Mobile Menu Mode is configured in Menu Location Settings. Navigation tree editing now happens only in Menu Manager.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/admin/menus/header-primary" className="inline-flex items-center gap-2 rounded-full bg-[#23212a] px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
            <Menu size={14} /> Manage Menu Items
          </Link>
          <Link href="/admin/menus/settings" className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#23212a]">
            Mobile Menu Settings
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-[#23212a]">CTA Button</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#23212a] mb-1">Label</label>
            <input
              type="text"
              value={data.cta?.label ?? ''}
              onChange={(e) => update({ cta: { ...data.cta, label: e.target.value } })}
              placeholder="Book Now"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#23212a] mb-1">Link (href)</label>
            <input
              type="text"
              value={data.cta?.href ?? ''}
              onChange={(e) => update({ cta: { ...data.cta, href: e.target.value } })}
              placeholder="/booking"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
