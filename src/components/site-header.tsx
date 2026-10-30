import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between px-6 sm:px-10">
      <Link href="/" className="flex items-center gap-2 text-ink">
        <UnbindMark />
        <span className="font-serif text-2xl leading-none">Unbind</span>
        <span className="font-mono text-[11px] tracking-wide text-faint">
          pdf → md
        </span>
      </Link>
      <a
        href="https://www.npmjs.com/package/@viswanadh_mudunuru/pdf-to-markdown"
        target="_blank"
        rel="noreferrer"
        className="font-mono text-xs text-muted transition-colors hover:text-ink"
      >
        npm package ↗
      </a>
    </header>
  );
}

/** Same drawing as src/app/icon.svg, themed through CSS tokens. */
function UnbindMark() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 32 32"
      fill="none"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
    >
      <path className="stroke-ink" d="M7 3.5h12.5L25 9v19.5H7z" />
      <path className="stroke-ink" d="M19.5 3.5V9H25" />
      <path
        className="stroke-accent"
        d="M14 14.5v9M18 14.5v9M11.5 17h9M11.5 21h9"
      />
    </svg>
  );
}
