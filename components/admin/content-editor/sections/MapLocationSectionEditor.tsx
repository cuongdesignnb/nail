'use client';

type MapLocationData = {
  title: string;
  googleMapsEmbedUrl: string;
};

type Props = { data: MapLocationData; onChange: (data: MapLocationData) => void };

export function MapLocationSectionEditor({ data, onChange }: Props) {
  function update(patch: Partial<MapLocationData>) {
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
          placeholder="Find Us"
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#23212a] mb-1">Google Maps Embed URL</label>
        <input
          type="text"
          value={data.googleMapsEmbedUrl}
          onChange={(e) => update({ googleMapsEmbedUrl: e.target.value })}
          placeholder="https://www.google.com/maps/embed?pb=..."
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[#23212a] outline-none focus:ring-2 focus:ring-[#B87D5B]/30 focus:border-[#B87D5B] transition"
        />
        <p className="text-xs text-gray-400 mt-1">
          Paste the embed URL from Google Maps (Share → Embed a map → copy the src URL)
        </p>
      </div>

      {data.googleMapsEmbedUrl && (
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm font-medium text-[#23212a] mb-2">Preview</p>
          <iframe
            src={data.googleMapsEmbedUrl}
            width="100%"
            height="200"
            className="rounded-lg border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  );
}
