import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

// Only needed for local dev with CF bindings
if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}
const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
