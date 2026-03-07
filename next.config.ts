import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
  images: {
    remotePatterns: [
      { hostname: "stan-bijou.s3.eu-north-1.amazonaws.com" },
    ],
  },
};


export default nextConfig;
