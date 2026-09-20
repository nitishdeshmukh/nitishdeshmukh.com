import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  /**
   * Disables Next.js built-in compression. In development, this prevents
   * Node `MaxListenersExceededWarning` on `[Gzip]` streams when Turbopack
   * serves multiple chunks concurrently. In production, edge/CDN layers
   * (e.g., Vercel) handle compression (Gzip/Brotli) automatically.
   */
  compress: false,
  /**
   * Stamped once per build and inlined. Reading the clock at render time would
   * instead report whenever a page was regenerated, which drifts on the ISR
   * routes and disagrees with the fully static ones.
   */
  env: {
    BUILD_TIMESTAMP: new Date().toISOString(),
  },
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: ["next-mdx-remote"],
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "*.localhost",
    "*.local",
    "192.168.29.124",
  ],
  devIndicators: false,
  experimental: {
    // Rewrite barrel imports to deep imports so a single icon doesn't pull the
    // whole package into the module graph. Next already optimizes lucide-react,
    // @tabler/icons-react, date-fns and lodash-es by default; these are the
    // heavy icon packages this app uses that are NOT on that default list.
    optimizePackageImports: ["@hugeicons/react", "@hugeicons/core-free-icons"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.nitishdeshmukh.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
    ],
    qualities: [75, 100],
  },
  compiler:
    process.env.NODE_ENV === "production"
      ? {
          removeConsole: {
            exclude: ["error"],
          },
        }
      : undefined,
  async redirects() {
    return [
      /**
       * /llms-full.txt used to serve the whole site as one document. It is now
       * covered by /llms.txt plus the per-section .md routes, so agents probing
       * the conventional URL land on the index instead of a 404.
       */
      {
        source: "/llms-full.txt",
        destination: "/llms.txt",
        permanent: true,
      },
      {
        source: "/blog/:slug.mdx",
        destination: "/blog/:slug.md",
        permanent: true,
      },
    ]
  },
  async rewrites() {
    return {
      // beforeFiles so these run before prerendered pages are served;
      // afterFiles rewrites never fire for SSG pages on Vercel, which
      // silently breaks Accept-based markdown negotiation in production
      beforeFiles: [
        {
          source: "/blog/:slug.md",
          destination: "/doc.md/:slug",
        },
        {
          source: "/blog/:slug",
          destination: "/doc.md/:slug",
          has: [
            {
              type: "header",
              key: "accept",
              value: "(?<accept>.*text/markdown.*)",
            },
          ],
        },
        {
          source: "/index.md",
          destination: "/llms.txt",
        },
        {
          source: "/",
          destination: "/llms.txt",
          has: [
            {
              type: "header",
              key: "accept",
              value: "(?<accept>.*text/markdown.*)",
            },
          ],
        },
      ],
      afterFiles: [
        {
          source: "/rss",
          destination: "/blog/rss",
        },
      ],
    }
  },
}

export default nextConfig
