import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const FEATURES = [
  "Headings",
  "Lists",
  "Tables",
  "Two columns",
  "Inline styles",
  "Images",
];

export default function Home() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <SiteHeader />

      <main className="flex min-h-0 flex-1 items-center px-6 sm:px-10">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <section>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
              PDF to Markdown
            </p>
            <h1 className="mt-5 font-serif text-[clamp(3rem,7vw,6.25rem)] leading-[0.95] tracking-tight">
              Documents,
              <br />
              <em className="text-accent">rewritten</em> as text.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              Drop in a PDF and get clean, structured Markdown back. The layout
              is read, not guessed at, so the structure survives.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href="/convert"
                className="group inline-flex h-12 items-center gap-3 rounded-full bg-ink px-7 text-sm font-medium text-paper transition-opacity hover:opacity-90"
              >
                Convert a PDF
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
              <span className="text-sm text-faint">
                Free · No account · Nothing stored
              </span>
            </div>
          </section>

          <Specimen />
        </div>
      </main>

      <footer className="hidden shrink-0 border-t border-line px-6 py-4 sm:block sm:px-10">
        <ul className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-1 font-mono text-xs text-muted">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-accent" />
              {f}
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}

/** A quiet before/after: a page silhouette beside the Markdown it becomes. */
function Specimen() {
  return (
    <div aria-hidden className="relative hidden h-[min(26rem,52vh)] lg:block">
      <div className="absolute left-0 top-0 h-[88%] w-[56%] rotate-[-3deg] rounded-sm border border-line bg-surface p-6 shadow-[0_1px_0_var(--line),0_24px_48px_-24px_rgb(0_0_0/0.18)]">
        <div className="h-3 w-3/4 rounded-full bg-ink/80" />
        <div className="mt-5 space-y-2">
          {[100, 94, 98, 62].map((w, i) => (
            <div
              key={i}
              className="h-1.5 rounded-full bg-line"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-px overflow-hidden rounded-sm border border-line bg-line">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="h-5 bg-surface" />
          ))}
        </div>
        <div className="mt-5 space-y-2.5">
          {[70, 82, 58].map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-faint" />
              <div
                className="h-1.5 rounded-full bg-line"
                style={{ width: `${w}%` }}
              />
            </div>
          ))}
        </div>
      </div>

      <pre className="absolute bottom-0 right-0 w-[62%] overflow-hidden rounded-sm border border-line bg-paper/95 p-6 font-mono text-[12.5px] leading-6 text-muted shadow-[0_24px_48px_-24px_rgb(0_0_0/0.22)] backdrop-blur">
        <span className="text-ink"># Quarterly review</span>
        {"\n\n"}Revenue grew <span className="text-ink">**18%**</span> on the
        {"\n"}back of two new regions.
        {"\n\n"}
        <span className="text-faint">| Region | Q3 | Q4 |</span>
        {"\n"}
        <span className="text-faint">| ------ | --- | --- |</span>
        {"\n"}| North | 4.1 | 4.8 |{"\n\n"}
        <span className="text-accent">-</span> Hiring on plan{"\n"}
        <span className="text-accent">-</span> Margins steady
      </pre>
    </div>
  );
}
