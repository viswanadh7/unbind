"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { convertPdf, type ConvertOptions } from "@/lib/convert-client";
import { MAX_FILE_BYTES } from "@/lib/limits";
import { Dropzone } from "./dropzone";
import { OptionsBar } from "./options-bar";
import { ConversionStatus } from "./conversion-status";
import { ResultView } from "./result-view";

export type ConverterState =
  | { phase: "idle"; error?: string }
  | { phase: "uploading"; file: File; progress: number }
  | { phase: "converting"; file: File; startedAt: number }
  | { phase: "done"; file: File; markdown: string; durationMs: number };

const DEFAULT_OPTIONS: ConvertOptions = {
  images: true,
  pageBreaks: false,
  keepHeadersFooters: false,
};

export function Converter() {
  const [state, setState] = useState<ConverterState>({ phase: "idle" });
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const abortRef = useRef<(() => void) | null>(null);

  const start = useCallback(
    async (file: File) => {
      if (
        file.type !== "application/pdf" &&
        !file.name.toLowerCase().endsWith(".pdf")
      ) {
        setState({ phase: "idle", error: `“${file.name}” isn't a PDF.` });
        return;
      }
      if (file.size > MAX_FILE_BYTES) {
        setState({
          phase: "idle",
          error: "That file is larger than the 25 MB limit.",
        });
        return;
      }

      setState({ phase: "uploading", file, progress: 0 });
      const job = convertPdf(file, options, {
        onUploadProgress: (progress) =>
          setState((s) => (s.phase === "uploading" ? { ...s, progress } : s)),
        onUploaded: () =>
          setState({ phase: "converting", file, startedAt: Date.now() }),
      });
      abortRef.current = job.abort;

      try {
        const { markdown, durationMs } = await job.promise;
        setState({ phase: "done", file, markdown, durationMs });
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setState({ phase: "idle" });
        } else {
          setState({
            phase: "idle",
            error: err instanceof Error ? err.message : String(err),
          });
        }
      } finally {
        abortRef.current = null;
      }
    },
    [options],
  );

  useTabTitle(state);

  if (state.phase === "done") {
    return (
      <ResultView
        fileName={state.file.name}
        markdown={state.markdown}
        durationMs={state.durationMs}
        onReset={() => setState({ phase: "idle" })}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center py-8">
      <div className="mb-8">
        <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
          Convert a PDF
        </h1>
        <p className="mt-2 text-muted">
          Files are processed in memory and discarded straight after. Up to 25
          MB.
        </p>
      </div>

      {state.phase === "idle" ? (
        <>
          <Dropzone onFile={start} />
          {state.error && (
            <p role="alert" className="mt-4 text-sm text-accent">
              {state.error}
            </p>
          )}
          <OptionsBar options={options} onChange={setOptions} />
        </>
      ) : (
        <ConversionStatus state={state} onCancel={() => abortRef.current?.()} />
      )}
    </div>
  );
}

/** Mirrors progress in the tab title, so it can be followed from another tab. */
function useTabTitle(state: ConverterState) {
  useEffect(() => {
    const original = document.title;
    if (state.phase === "uploading") {
      document.title = `Uploading ${Math.round(state.progress * 100)}% · Unbind`;
    } else if (state.phase === "converting") {
      document.title = "Converting… · Unbind";
    } else if (state.phase === "done") {
      document.title = "✓ Ready · Unbind";
    }
    return () => {
      document.title = original;
    };
  }, [state]);
}
