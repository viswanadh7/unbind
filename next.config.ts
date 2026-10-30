import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // The converter relies on Node built-ins and pdf.js resolving its own worker
  // file at runtime, so it must be loaded with native Node instead of bundled.
  serverExternalPackages: ["@viswanadh_mudunuru/pdf-to-markdown", "pdfjs-dist"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
