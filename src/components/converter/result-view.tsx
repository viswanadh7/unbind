"use client";

import { useMemo, useState } from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import { formatBytes } from "@/lib/convert-client";

type Tab = "preview" | "markdown";

export function ResultView({
  fileName,
  markdown,
  durationMs,
  onReset,
}: {
  fileName: string;
  markdown: string;
  durationMs: number;
  onReset: () => void;
}) {
  const [tab, setTab] = useState<Tab>("preview");
  const [copied, setCopied] = useState(false);
  const mdName = fileName.replace(/\.pdf$/i, "") + ".md";

  const stats = useMemo(() => {
    const text = markdown.replace(DATA_URI_DEFINITION, "");
    return {
      words: text.split(/\s+/).filter(Boolean).length,
      bytes: new Blob([markdown]).size,
    };
  }, [markdown]);

  const empty = markdown.trim().length === 0;

  async function copy() {
    await navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function download() {
    const url = URL.createObjectURL(
      new Blob([markdown], { type: "text/markdown;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = mdName;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col pt-4">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p
            className="flex items-center gap-2 text-sm text-muted"
            role="status"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-ink text-[9px] text-paper">
              ✓
            </span>
            Converted in {(durationMs / 1000).toFixed(1)}s
          </p>
          <h1 className="mt-2 truncate font-serif text-3xl tracking-tight sm:text-4xl">
            {mdName}
          </h1>
          <p className="mt-1 font-mono text-xs text-faint">
            {stats.words.toLocaleString()} words · {formatBytes(stats.bytes)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="h-10 rounded-full px-4 text-sm text-muted transition-colors hover:text-ink"
          >
            New file
          </button>
          <button
            type="button"
            onClick={copy}
            disabled={empty}
            className="h-10 min-w-20 rounded-full border border-line bg-surface px-4 text-sm transition-colors hover:border-faint disabled:opacity-40"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={download}
            disabled={empty}
            className="h-10 rounded-full bg-ink px-5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            Download .md
          </button>
        </div>
      </div>

      <div className="mt-8 flex flex-1 flex-col overflow-hidden rounded-2xl border border-line bg-surface">
        <div className="flex border-b border-line px-2" role="tablist">
          {(["preview", "markdown"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`relative px-4 py-3 text-sm capitalize transition-colors ${
                tab === t ? "text-ink" : "text-muted hover:text-ink"
              }`}
            >
              {t}
              {tab === t && (
                <span className="absolute inset-x-4 -bottom-px h-px bg-ink" />
              )}
            </button>
          ))}
        </div>

        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
            <p className="font-medium">No text found in this PDF.</p>
            <p className="mt-1 max-w-sm text-sm text-muted">
              It may be a scanned document with no text layer. Run it through
              OCR first, then convert again.
            </p>
          </div>
        ) : tab === "preview" ? (
          <article className="prose prose-neutral max-w-none px-6 py-8 sm:px-12 sm:py-10 dark:prose-invert prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight prose-a:text-accent prose-code:before:content-none prose-code:after:content-none prose-pre:bg-paper prose-pre:text-ink prose-pre:border prose-pre:border-line prose-img:rounded-md prose-table:text-sm">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              urlTransform={allowImageDataUris}
            >
              {markdown}
            </ReactMarkdown>
          </article>
        ) : (
          <pre className="overflow-x-auto px-6 py-8 font-mono text-[13px] leading-6 whitespace-pre-wrap break-words text-ink sm:px-10">
            {collapseDataUris(markdown)}
          </pre>
        )}
      </div>
    </div>
  );
}

const DATA_URI_DEFINITION =
  /^(\[[^\]]+\]:\s*)data:image\/[a-z+]+;base64,([A-Za-z0-9+/=]+)\s*$/gm;

/** Base64 image data is unreadable noise on screen; show its size instead. Copy and download keep it. */
function collapseDataUris(markdown: string) {
  return markdown.replace(
    DATA_URI_DEFINITION,
    (_, label: string, data: string) =>
      `${label}data:image/png;base64,… (${formatBytes((data.length * 3) / 4)})`,
  );
}

/** react-markdown strips data: URLs by default; the package embeds images that way. */
function allowImageDataUris(url: string) {
  return url.startsWith("data:image/") ? url : defaultUrlTransform(url);
}
