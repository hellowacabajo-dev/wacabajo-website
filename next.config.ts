import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /**
   * Ada lockfile lain di direktori induk ("LETS GO GIG"), jadi root trace
   * dikunci ke folder app ini supaya Next tidak salah menebak workspace root.
   */
  outputFileTracingRoot: import.meta.dirname,
  images: {
    formats: ["image/webp"],
  },
};

export default nextConfig;
