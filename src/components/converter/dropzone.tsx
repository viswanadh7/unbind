"use client";

import { useRef, useState } from "react";

export function Dropzone({ onFile }: { onFile: (file: File) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null))
          setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) onFile(file);
      }}
      className={`relative rounded-2xl border border-dashed transition-colors ${
        dragging
          ? "border-accent bg-accent/5"
          : "border-line bg-surface hover:border-faint"
      }`}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center px-6 py-16 text-center outline-none focus-visible:ring-2 focus-visible:ring-accent/40 rounded-2xl sm:py-20"
      >
        <PdfGlyph active={dragging} />
        <span className="mt-6 text-lg font-medium">
          {dragging ? "Release to convert" : "Drop a PDF here"}
        </span>
        <span className="mt-1.5 text-sm text-muted">
          or{" "}
          <span className="text-ink underline decoration-line underline-offset-4">
            browse your files
          </span>
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onFile(file);
        }}
      />
    </div>
  );
}

function PdfGlyph({ active }: { active: boolean }) {
  return (
    <div
      className={`relative flex h-16 w-13 items-end justify-center rounded-[4px] border bg-paper pb-2 transition-transform duration-300 ${
        active ? "-translate-y-1 border-accent" : "border-line"
      }`}
    >
      <span className="absolute right-0 top-0 h-3.5 w-3.5 rounded-bl-[3px] border-b border-l border-line bg-surface" />
      <span className="font-mono text-[10px] font-medium tracking-wider text-muted">
        PDF
      </span>
    </div>
  );
}
