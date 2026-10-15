import { ogContentType, ogSize, renderCard } from "@/lib/og";

export const alt = "Vinit Churi — an engineer who builds products and agents: TraceSarkar, Hookline, ReelForge and Fillmore.";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export default function Image() {
  return renderCard({
    kicker: "TraceSarkar · Hookline · ReelForge · Fillmore",
    title: "Hi, I’m Vinit.",
    subtitle: "I find real problems and build products and agents that fix them.",
    footer: "An engineer in Mumbai · vinitchuri.dev",
  });
}
