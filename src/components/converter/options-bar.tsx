"use client";

import type { ConvertOptions } from "@/lib/convert-client";

const FIELDS: { key: keyof ConvertOptions; label: string; hint: string }[] = [
  { key: "images", label: "Embed images", hint: "Included inline as PNG data" },
  {
    key: "pageBreaks",
    label: "Page breaks",
    hint: "Separate pages with a rule",
  },
  {
    key: "keepHeadersFooters",
    label: "Headers & footers",
    hint: "Keep running headers and page numbers",
  },
];

export function OptionsBar({
  options,
  onChange,
}: {
  options: ConvertOptions;
  onChange: (options: ConvertOptions) => void;
}) {
  return (
    <fieldset className="mt-8 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
      <legend className="sr-only">Conversion options</legend>
      {FIELDS.map(({ key, label, hint }) => (
        <label
          key={key}
          className="flex cursor-pointer items-start justify-between gap-4 bg-paper px-4 py-3.5 transition-colors hover:bg-surface"
        >
          <span>
            <span className="block text-sm font-medium">{label}</span>
            <span className="mt-0.5 block text-xs text-muted">{hint}</span>
          </span>
          <input
            type="checkbox"
            checked={options[key]}
            onChange={(e) => onChange({ ...options, [key]: e.target.checked })}
            className="peer sr-only"
          />
          <span
            aria-hidden
            className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-line transition-colors peer-checked:bg-ink peer-focus-visible:ring-2 peer-focus-visible:ring-accent/40 after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-surface after:shadow-sm after:transition-transform peer-checked:after:translate-x-4"
          />
        </label>
      ))}
    </fieldset>
  );
}
