import createMDX from "@next/mdx";
import type { NextConfig } from "next";

// Fully static site (ADR-0001): no server-side features may be added here.
// `next build` writes plain files to `out/`, served by Cloudflare Workers
// static assets (`wrangler.jsonc`). Redirects live in `public/_redirects`,
// because `redirects()` is ignored under `output: "export"`.
const nextConfig: NextConfig = {
  output: "export",
  // No image optimisation server on a static host: images ship as they are.
  images: { unoptimized: true },
};

// MDX is used for the Overload prose only.
const withMDX = createMDX({});

export default withMDX(nextConfig);
