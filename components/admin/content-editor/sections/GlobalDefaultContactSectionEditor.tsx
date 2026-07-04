'use client';

type DefaultContactData = {
  phone: string;
  email: string;
  address: string;
  hours: string;
};

type Props = { data: DefaultContactData; onChange: (data: DefaultContactData) => void };

export function GlobalDefaultContactSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<DefaultContactData>) {
    onChange({ ...data, ...patch });
  }

  return (
    <div className="space-y-4">
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
          placeholder="123 Beauty Street, City, State ZIP"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Business Hours</label>
        <input
          type="text"
          value={data.hours}
          onChange={(e) => update({ hours: e.target.value })}
          placeholder="Mon-Sat: 9AM-7PM, Sun: Closed"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
        <p className="text-xs text-gray-400 mt-1">Default hours used across the site when no page-specific hours are set</p>
      </div>
    </div>
  );
}
