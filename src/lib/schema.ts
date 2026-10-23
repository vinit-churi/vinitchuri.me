import { FILLMORE_STORE_URL } from "@/content/agents";
import type { Post } from "@/content/posts";
import { getProduct, type Product } from "@/content/products";
import { absoluteUrl, site } from "@/content/site";
import { getPerson, team } from "@/content/team";

const meId = `${site.url}/#person`;
const websiteId = `${site.url}/#website`;
const personId = (slug: string) => (slug === "vinit-churi" ? meId : `${site.url}/about#${slug}`);

/** The site's owner. Everyone else appears as a collaborator. */
export function ownerSchema() {
  const me = getPerson("vinit-churi");
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": meId,
    name: me.name,
    url: site.url,
    image: absoluteUrl("/icons/icon-512.png"),
    email: site.email,
    jobTitle: "Software engineer",
    description: site.description,
    address: { "@type": "PostalAddress", addressLocality: site.city, addressCountry: site.country },
    sameAs: site.social.map((s) => s.href),
    memberOf: { "@type": "Organization", name: "Logicvell", url: "https://logicvell.com" },
    knowsAbout: ["AI agents", "Go", "PostGIS", "Flutter", "FFmpeg", "WebGPU", "Next.js"],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: site.url,
    name: site.name,
    description: site.description,
    inLanguage: "en-IN",
    publisher: { "@id": meId },
  };
}

export function personSchema(slug: string) {
  const p = getPerson(slug);
  return {
    "@type": "Person",
    "@id": personId(slug),
    name: p.name,
    url: slug === "vinit-churi" ? site.url : absoluteUrl(`/about#${slug}`),
  };
}

export function aboutSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: absoluteUrl("/about"),
    name: `About ${site.name}`,
    isPartOf: { "@id": websiteId },
    mainEntity: { "@id": meId },
    about: team.map((p) => personSchema(p.slug)),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

const productCategory: Record<Product["slug"], string> = {
  tracesarkar: "GovernmentApplication",
  hookline: "MultimediaApplication",
  viharsync: "BusinessApplication",
  reelforge: "MultimediaApplication",
  infoyantra: "ReferenceApplication",
};

/** Fillmore, as an installable app: free, on the Chrome Web Store. */
export function fillmoreSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${absoluteUrl("/agents/fillmore")}#software`,
    name: "Fillmore",
    description:
      "A Chrome extension that fills long web forms from your own documents, asks when it isn’t sure, and leaves Submit to you. Everything stays on your device.",
    url: FILLMORE_STORE_URL,
    mainEntityOfPage: absoluteUrl("/agents/fillmore"),
    applicationCategory: "BrowserApplication",
    operatingSystem: "Chrome",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: { "@id": meId },
  };
}

export function productSchema(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${absoluteUrl(`/work/${product.slug}`)}#software`,
    name: product.name,
    description: product.summary,
    url: product.url,
    mainEntityOfPage: absoluteUrl(`/work/${product.slug}`),
    applicationCategory: productCategory[product.slug],
    operatingSystem: "Web",
    image: absoluteUrl(`/work/${product.slug}/opengraph-image`),
    creator: { "@id": meId },
    author: product.builtBy.map((slug) => personSchema(slug)),
  };
}

export function blogSchema(posts: Post[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${absoluteUrl("/writing")}#blog`,
    url: absoluteUrl("/writing"),
    name: `${site.name} — Writing`,
    description: "Notes from building, shipping and launching TraceSarkar, ReelForge, ViharSync and the agents in my lab.",
    publisher: { "@id": meId },
    inLanguage: "en-IN",
    blogPost: posts.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: absoluteUrl(`/writing/${p.slug}`),
      datePublished: p.date,
    })),
  };
}

export function postSchema(post: Post, productName?: string) {
  const url = absoluteUrl(`/writing/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.dek,
    url,
    mainEntityOfPage: url,
    image: absoluteUrl(`/writing/${post.slug}/opengraph-image`),
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "en-IN",
    articleSection: post.category,
    keywords: [post.category, productName, site.name].filter(Boolean).join(", "),
    timeRequired: `PT${post.readingMinutes}M`,
    author: post.authors.map((slug) => personSchema(slug)),
    publisher: { "@id": meId },
    isPartOf: { "@id": `${absoluteUrl("/writing")}#blog` },
    ...(post.product && getProduct(post.product)?.listed !== false
      ? { about: { "@id": `${absoluteUrl(`/work/${post.product}`)}#software` } }
      : {}),
  };
}
