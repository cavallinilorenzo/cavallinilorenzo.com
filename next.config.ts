import type { NextConfig } from "next";

// Fully static site (ADR-0001): no server-side features may be added here.
const nextConfig: NextConfig = {
  // Permanent (308) redirects for old URLs. Keep them as plain source ->
  // destination pairs so they translate 1:1 to a Cloudflare `_redirects` file.
  async redirects() {
    return [
      { source: "/startups", destination: "/projects", permanent: true },
      { source: "/events", destination: "/experience", permanent: true },
      // `:path+` needs at least one segment, so `/freelance` stays a page.
      {
        source: "/freelance/:path+",
        destination: "/freelance",
        permanent: true,
      },
      { source: "/assets/cv.pdf", destination: "/cv.pdf", permanent: true },
    ];
  },
};

export default nextConfig;
