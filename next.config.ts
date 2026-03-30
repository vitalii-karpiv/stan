import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/**/*": ["./src/generated/prisma/**/*"],
  },
  experimental: {
    // With middleware on /admin, Next buffers the body for the route; default is 10MB.
    // Must be >= serverActions.bodySizeLimit for large uploads (e.g. builder parts).
    proxyClientMaxBodySize: "500mb",
    serverActions: {
      // Per-file limit is enforced in actions; batch uploads need headroom (e.g. several 100 MB files).
      bodySizeLimit: "500mb",
    },
  },
  images: {
    remotePatterns: [
      { hostname: "stan-bijou.s3.eu-north-1.amazonaws.com" },
    ],
  },
};


export default nextConfig;
