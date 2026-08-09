import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // This demo sits inside a folder of sibling demos, each with its own
  // lockfile. Pinning the root stops Turbopack guessing the parent directory.
  turbopack: {
    root: path.resolve(import.meta.dirname),
  },
};

export default nextConfig;
