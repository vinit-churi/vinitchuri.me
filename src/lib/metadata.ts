import type { Metadata } from "next";
import { site } from "@/content/site";

type PageMeta = {
  title: string;
  description: string;
  /** Path of the page, e.g. "/work". Used for the canonical URL and og:url. */
  path: string;
  /** Use the title as-is instead of applying the "· Vinit Churi" template. */
  absoluteTitle?: boolean;
  keywords?: string[];
  /** Social image for this page: its own generated card, or the site card by default. */
  image?: { url: string; alt: string };
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    authors: string[];
    section: string;
    tags?: string[];
  };
};

const siteImage = {
  url: "/opengraph-image",
  alt: `${site.name} — an engineer who builds products and agents: TraceSarkar, Hookline, ReelForge and Fillmore.`,
};

/**
 * Full metadata for a page. OpenGraph is rebuilt here rather than inherited because
 * Next.js replaces (not merges) a parent's openGraph object when a page sets its own,
 * and config images take precedence over a segment's opengraph-image file.
 */
export function pageMetadata({ title, description, path, absoluteTitle, keywords, image, article }: PageMeta): Metadata {
  const url = path === "/" ? "/" : path;
  const ogImage = { ...(image ?? siteImage), width: 1200, height: 630, type: "image/png" };
  const socialTitle = absoluteTitle ? title : `${title} · ${site.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords: keywords ? [...keywords, site.name] : undefined,
    alternates: {
      canonical: url,
      types: { "application/rss+xml": [{ url: "/rss.xml", title: `${site.name} — Writing` }] },
    },
    openGraph: {
      title: socialTitle,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      images: [ogImage],
      ...(article
        ? {
            type: "article",
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime ?? article.publishedTime,
            authors: article.authors,
            section: article.section,
            tags: article.tags,
          }
        : { type: "website" }),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [ogImage],
    },
  };
}
