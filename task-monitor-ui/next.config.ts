import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: false,
  // Disable request logging in development
  logging: {
    fetches: {
      fullUrl: false,
    },
  },
};

export default nextConfig;
