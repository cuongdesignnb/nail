'use client';

type CtaData = {
  title: string;
  description: string;
  button: { label: string; href: string };
  phone: string;
  email: string;
  address: string;
  hours: string;
};

type Props = { data: CtaData; onChange: (data: CtaData) => void };

export function CtaSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<CtaData>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Title</label>
        <input
          type="text"
          value={data.title}
          onChange={(e) => update({ title: e.target.value })}
          placeholder="Ready to book your appointment?"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Short call-to-action description"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[100px]"
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium text-[#23212a]">Button</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-[#23212a] mb-1">Label</label>
            <input
              type="text"
              value={data.button?.label ?? ''}
              onChange={(e) => update({ button: { ...data.button, label: e.target.value } })}
              placeholder="Book Now"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#23212a] mb-1">Link (href)</label>
            <input
              type="text"
              value={data.button?.href ?? ''}
              onChange={(e) => update({ button: { ...data.button, href: e.target.value } })}
              placeholder="/booking"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Phone</label>
          <input
            type="text"
            value={data.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="+1 (555) 123-4567"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Email</label>
          <input
            type="text"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="hello@aeranaillounge.com"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Address</label>
        <input
          type="text"
          value={data.address}
          onChange={(e) => update({ address: e.target.value })}
          placeholder="123 Beauty Street, City"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Hours</label>
        <input
          type="text"
          value={data.hours}
          onChange={(e) => update({ hours: e.target.value })}
          placeholder="Mon-Sat: 9AM-7PM"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>
    </div>
  );
}
