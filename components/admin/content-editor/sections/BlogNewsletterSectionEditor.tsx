'use client';

type NewsletterData = {
  title: string;
  description: string;
  placeholder: string;
  buttonLabel: string;
};

type Props = { data: NewsletterData; onChange: (data: NewsletterData) => void };

export function BlogNewsletterSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<NewsletterData>) {
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
          placeholder="Subscribe to Our Newsletter"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Description</label>
        <textarea
          value={data.description}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Get the latest beauty tips and promotions delivered to your inbox"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[100px]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Input Placeholder</label>
          <input
            type="text"
            value={data.placeholder}
            onChange={(e) => update({ placeholder: e.target.value })}
            placeholder="Enter your email address"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#23212a] mb-1">Button Label</label>
          <input
            type="text"
            value={data.buttonLabel}
            onChange={(e) => update({ buttonLabel: e.target.value })}
            placeholder="Subscribe"
            className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
          />
        </div>
      </div>
    </div>
  );
}
