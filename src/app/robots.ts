import type { MetadataRoute } from "next";

function getSiteUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL;
  if (!rawUrl) return null;
  return rawUrl.replace(/\/+$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/_next/"],
      },
    ],
    sitemap: siteUrl ? `${siteUrl}/sitemap.xml` : undefined,
    host: siteUrl ?? undefined,
  };
}
