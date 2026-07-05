'use client';

interface SectionVisibilityToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function SectionVisibilityToggle({
  label,
  checked,
  onChange,
  description,
}: SectionVisibilityToggleProps) {
  return (
    <div className="flex items-start justify-between rounded-lg border border-neutral-200/80 bg-white p-4 transition-all hover:bg-neutral-50/30">
      <div className="space-y-0.5">
        <label className="text-sm font-semibold text-neutral-800 cursor-pointer select-none">
          {label}
        </label>
        {description && (
          <p className="text-xs text-neutral-500">
            {description}
          </p>
        )}
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-amber-600' : 'bg-neutral-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}
