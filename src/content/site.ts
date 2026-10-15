export const site = {
  name: "Vinit Churi",
  /** Canonical origin. Override per environment with NEXT_PUBLIC_SITE_URL (no trailing slash). */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinitchuri.dev").replace(/\/$/, ""),
  email: "hello@vinitchuri.dev",
  tagline: "I build things that work",
  description:
    "Vinit Churi is an engineer in Mumbai who builds products and AI agents for real problems: TraceSarkar for civic accountability, Hookline and ReelForge for short-form video, and Fillmore, a form-filling agent.",
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
    "civic tech India",
    "building in public",
  ],
  social: [
    { label: "GitHub", href: "https://github.com/vinit-churi" },
    { label: "Logicvell", href: "https://logicvell.com" },
  ],
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
