'use client';

type TermsData = {
  title: string;
  content: string;
};

type Props = { data: TermsData; onChange: (data: TermsData) => void };

export function TermsAndConditionsSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<TermsData>) {
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
          placeholder="Terms & Conditions"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Content</label>
        <textarea
          value={data.content}
          onChange={(e) => update({ content: e.target.value })}
          placeholder="Enter promotion terms and conditions..."
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition min-h-[200px]"
        />
        <p className="text-xs text-gray-400 mt-1">Supports plain text. Use line breaks for paragraphs.</p>
      </div>
    </div>
  );
}
