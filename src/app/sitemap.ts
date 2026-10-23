import type { MetadataRoute } from "next";
import { agents } from "@/content/agents";
import { posts } from "@/content/posts";
import { products } from "@/content/products";
import { absoluteUrl } from "@/content/site";

export const dynamic = "force-static";

/** Bump when site-wide pages change meaningfully. */
const siteUpdated = "2026-10-23";

export default function sitemap(): MetadataRoute.Sitemap {
  const latestPost = posts.reduce((d, p) => (p.date > d ? p.date : d), siteUpdated);

  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: latestPost, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/work"), lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/writing"), lastModified: latestPost, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/about"), lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/now"), lastModified: siteUpdated, changeFrequency: "weekly", priority: 0.6 },
  ];

  const work: MetadataRoute.Sitemap = products.map((p) => ({
    url: absoluteUrl(`/work/${p.slug}`),
    lastModified: siteUpdated,
    changeFrequency: "monthly",
    priority: 0.8,
    images: [absoluteUrl(`/work/${p.slug}/opengraph-image`)],
  }));

  const writing: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/writing/${p.slug}`),
    lastModified: p.date,
    changeFrequency: "yearly",
    priority: 0.7,
    images: [absoluteUrl(`/writing/${p.slug}/opengraph-image`)],
  }));

  const agentPages: MetadataRoute.Sitemap = agents
    .filter((a) => a.href)
    .map((a) => ({ url: absoluteUrl(a.href!), lastModified: siteUpdated, changeFrequency: "monthly", priority: 0.8 }));

  return [...pages, ...work, ...agentPages, ...writing];
}
