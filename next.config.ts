import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production optimizations
  reactStrictMode: true,
  devIndicators: false,
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Optimize images
  images: {
    unoptimized: true,
  },
  
  // Production compiler options
  compiler: {
    // Remove console.log in production
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
