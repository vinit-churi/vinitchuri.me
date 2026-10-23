export const site = {
  name: "Vinit Churi",
  /** Canonical origin. Override per environment with NEXT_PUBLIC_SITE_URL (no trailing slash). */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinitchuri.me").replace(/\/$/, ""),
  email: "hello@vinitchuri.me",
  tagline: "I build things that work",
  description:
    "Vinit Churi is an engineer in Mumbai who builds products and AI agents for real problems: TraceSarkar for civic accountability, Hookline and ReelForge for short-form video, Fillmore, a form-filling agent, and infoyantra, a planned data layer over Indian government notices.",
  city: "Mumbai",
  country: "IN",
  timeZone: "Asia/Kolkata",
  locale: "en_IN",
  keywords: [
    "Vinit Churi",
    "software engineer Mumbai",
    "AI agents",
    "TraceSarkar",
    "Hookline",
    "ReelForge",
    "Fillmore",
    "form-filling agent",
    "infoyantra",
    "civic tech India",
    "building in public",
  ],
  social: [
    { label: "GitHub", href: "https://github.com/vinit-churi" },
    { label: "YouTube", href: "https://www.youtube.com/@buildtofindout" },
  ],
  youtube: { name: "Build to Find Out", handle: "@buildtofindout", href: "https://www.youtube.com/@buildtofindout" },
} as const;

export const nav = [
  { label: "Work", href: "/work" },
  { label: "Agents", href: "/#agents" },
  { label: "Writing", href: "/writing" },
  { label: "Now", href: "/now" },
  { label: "About", href: "/about" },
] as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path === "/" ? "" : path}`;
}
