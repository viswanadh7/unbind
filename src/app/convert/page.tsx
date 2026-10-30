import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { Converter } from "@/components/converter/converter";

export const metadata: Metadata = {
  title: "Convert — Unbind",
};

export default function ConvertPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex flex-1 flex-col px-6 pb-10 sm:px-10">
        <Converter />
      </main>
    </div>
  );
}
