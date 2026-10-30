export interface ConvertOptions {
  images: boolean;
  pageBreaks: boolean;
  keepHeadersFooters: boolean;
}

export interface ConvertResult {
  markdown: string;
  durationMs: number;
}

interface ConvertCallbacks {
  /** Upload progress from 0 to 1. */
  onUploadProgress: (fraction: number) => void;
  /** The file has fully reached the server and conversion has begun. */
  onUploaded: () => void;
}

/**
 * Uploads a PDF to the conversion endpoint. XHR rather than fetch, because
 * fetch cannot report upload progress.
 */
export function convertPdf(
  file: File,
  options: ConvertOptions,
  { onUploadProgress, onUploaded }: ConvertCallbacks,
): { promise: Promise<ConvertResult>; abort: () => void } {
  const xhr = new XMLHttpRequest();

  const promise = new Promise<ConvertResult>((resolve, reject) => {
    const body = new FormData();
    body.append("file", file);
    for (const [key, value] of Object.entries(options))
      body.append(key, String(value));

    xhr.open("POST", "/api/convert");
    xhr.responseType = "json";

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onUploadProgress(e.loaded / e.total);
    };
    xhr.upload.onload = () => onUploaded();

    xhr.onload = () => {
      const data = xhr.response as Partial<ConvertResult> & { error?: string };
      if (
        xhr.status >= 200 &&
        xhr.status < 300 &&
        typeof data?.markdown === "string"
      ) {
        resolve({ markdown: data.markdown, durationMs: data.durationMs ?? 0 });
      } else {
        reject(
          new Error(data?.error ?? "The server couldn't convert this file."),
        );
      }
    };
    xhr.onerror = () =>
      reject(new Error("Network error. Check your connection and try again."));
    xhr.onabort = () => reject(new DOMException("Cancelled", "AbortError"));

    xhr.send(body);
  });

  return { promise, abort: () => xhr.abort() };
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
