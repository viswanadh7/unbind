"use client";

import { useEffect, useState } from "react";
import { formatBytes } from "@/lib/convert-client";
import type { ConverterState } from "./converter";

type ActiveState = Extract<
  ConverterState,
  { phase: "uploading" | "converting" }
>;

export function ConversionStatus({
  state,
  onCancel,
}: {
  state: ActiveState;
  onCancel: () => void;
}) {
  const uploading = state.phase === "uploading";
  const elapsed = useElapsedSeconds(
    state.phase === "converting" ? state.startedAt : null,
  );

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-surface">
      <div className="flex items-center gap-4 border-b border-line px-6 py-5">
        <div className="flex h-11 w-9 shrink-0 items-end justify-center rounded-[3px] border border-line bg-paper pb-1.5">
          <span className="font-mono text-[8px] tracking-wider text-muted">
            PDF
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-medium">{state.file.name}</p>
          <p className="text-sm text-muted">{formatBytes(state.file.size)}</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-paper hover:text-ink"
        >
          Cancel
        </button>
      </div>

      <ol className="px-6 py-6" aria-live="polite">
        <Step
          status={uploading ? "active" : "done"}
          title={uploading ? "Uploading" : "Uploaded"}
          detail={
            uploading
              ? `${Math.round(state.progress * 100)}%`
              : formatBytes(state.file.size)
          }
        />
        <Step
          status={uploading ? "pending" : "active"}
          title="Reading the layout"
          detail={uploading ? "" : `${elapsed}s`}
          note={
            uploading
              ? undefined
              : elapsed >= 12
                ? "Larger documents take a little longer. Still working."
                : "Finding headings, paragraphs, lists, tables and columns."
          }
        />
        <Step status="pending" title="Markdown ready" last />
      </ol>

      <div className="h-0.5 overflow-hidden bg-line">
        {uploading ? (
          <div
            className="h-full bg-ink transition-[width] duration-200"
            style={{ width: `${state.progress * 100}%` }}
          />
        ) : (
          <div className="animate-sweep h-full w-1/4 bg-accent" />
        )}
      </div>
    </div>
  );
}

function Step({
  status,
  title,
  detail,
  note,
  last,
}: {
  status: "pending" | "active" | "done";
  title: string;
  detail?: string;
  note?: string;
  last?: boolean;
}) {
  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      {!last && (
        <span className="absolute left-[7px] top-5 bottom-0 w-px bg-line" />
      )}
      <span className="relative mt-1 flex h-[15px] w-[15px] shrink-0 items-center justify-center">
        {status === "done" && (
          <span className="flex h-full w-full items-center justify-center rounded-full bg-ink text-[9px] text-paper">
            ✓
          </span>
        )}
        {status === "active" && (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/30" />
            <span className="h-[9px] w-[9px] rounded-full bg-accent" />
          </>
        )}
        {status === "pending" && (
          <span className="h-full w-full rounded-full border border-line" />
        )}
      </span>
      <div className="flex-1">
        <div className="flex items-baseline justify-between gap-4">
          <span className={status === "pending" ? "text-faint" : "text-ink"}>
            {title}
          </span>
          {detail && (
            <span className="font-mono text-xs tabular-nums text-muted">
              {detail}
            </span>
          )}
        </div>
        {note && <p className="mt-1 text-sm text-muted">{note}</p>}
      </div>
    </li>
  );
}

function useElapsedSeconds(since: number | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (since === null) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [since]);
  return since === null ? 0 : Math.max(0, Math.floor((now - since) / 1000));
}
