import { pdfToMarkdown } from "@viswanadh_mudunuru/pdf-to-markdown";
import { MAX_FILE_BYTES } from "@/lib/limits";

export const maxDuration = 60;

function fail(status: number, error: string) {
  return Response.json({ error }, { status });
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail(400, "Expected a file upload.");
  }

  const file = form.get("file");
  if (!(file instanceof File)) return fail(400, "No file was attached.");
  if (file.size === 0) return fail(400, "The file is empty.");
  if (file.size > MAX_FILE_BYTES)
    return fail(413, "This file is larger than the 25 MB limit.");

  const bytes = new Uint8Array(await file.arrayBuffer());
  // "%PDF-" signature; extensions and MIME types are not trustworthy.
  const isPdf =
    bytes[0] === 0x25 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x44 &&
    bytes[3] === 0x46;
  if (!isPdf) return fail(415, "That file isn't a PDF.");

  const started = performance.now();
  try {
    const markdown = await pdfToMarkdown(bytes, {
      pageBreaks: form.get("pageBreaks") === "true",
      keepHeadersFooters: form.get("keepHeadersFooters") === "true",
      images: form.get("images") !== "false",
    });
    return Response.json({
      markdown,
      durationMs: Math.round(performance.now() - started),
    });
  } catch (err) {
    const name = err instanceof Error ? err.name : "";
    if (name === "PasswordException") {
      return fail(
        422,
        "This PDF is password-protected. Remove the password and try again.",
      );
    }
    if (name === "InvalidPDFException") {
      return fail(422, "This PDF appears to be damaged and couldn't be read.");
    }
    console.error("Conversion failed", err);
    return fail(500, "Something went wrong while converting this PDF.");
  }
}
