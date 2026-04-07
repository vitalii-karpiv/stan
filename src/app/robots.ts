import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();
  const hasEnv =
    Boolean(process.env.NEXT_PUBLIC_SITE_URL) || Boolean(process.env.SITE_URL);

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/_next/"],
      },
    ],
    sitemap: hasEnv ? `${siteUrl}/sitemap.xml` : undefined,
    host: hasEnv ? siteUrl : undefined,
  };
}
