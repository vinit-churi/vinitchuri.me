import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Every page is static: export plain files and serve them as Cloudflare Worker static assets.
  output: "export",
  experimental: {
    // Product art morphs between the work list and each product page (<ViewTransition>).
    viewTransition: true,
  },
};

export default nextConfig;
