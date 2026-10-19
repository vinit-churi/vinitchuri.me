import type { Metadata } from "next";
import Link from "next/link";
import { ProductRow } from "@/components/product-row";
import { Reveal } from "@/components/reveal";
import { products } from "@/content/products";
import { site } from "@/content/site";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Work",
  description:
    "Products built by Vinit Churi: TraceSarkar (civic accountability, Mumbai), Hookline (an agentic video studio) and ReelForge (AI video editing) — with the story and dated journey of each.",
  path: "/work",
  keywords: ["TraceSarkar", "Hookline", "ReelForge", "product case studies"],
});

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-[1120px] px-6 pt-20 sm:pt-28">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: products.map((p, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${site.url}/work/${p.slug}`,
              name: p.name,
            })),
          },
        ]}
      />
      <header className="max-w-3xl">
        <p className="animate-[fade-lift_700ms_var(--ease-out-soft)_both] font-mono text-xs text-muted">Work</p>
        <h1 className="mt-4 animate-[fade-lift_700ms_var(--ease-out-soft)_80ms_both] text-[clamp(2.75rem,6.4vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.05em]">
          Three problems. <span className="font-serif font-normal tracking-[-0.02em] italic">Nothing in common.</span>
        </h1>
        <p className="mt-8 animate-[fade-lift_700ms_var(--ease-out-soft)_160ms_both] text-xl leading-relaxed text-ink-soft">
          A civic accountability platform, an agentic video studio and a video editor. TraceSarkar is mine alone;
          Hookline and ReelForge I build with Kenil Joshi. Each one has a story, dated from its first commit.
        </p>
      </header>

      <div className="mt-20 border-b border-line">
        {products.map((product, i) => (
          <Reveal key={product.slug} delay={i * 60}>
            <ProductRow product={product} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-16">
        <Link
          href="/#agents"
          className="group grid items-center gap-8 rounded-3xl border border-dashed border-ink/30 p-8 transition-colors hover:border-ink sm:grid-cols-[auto_1fr] sm:p-12"
        >
          <span className="flex h-24 w-24 items-center justify-center rounded-2xl border border-dashed border-ink/40 font-serif text-5xl text-muted italic">
            4
          </span>
          <div>
            <p className="font-mono text-xs text-muted">Agents</p>
            <h2 className="mt-2 text-3xl font-bold tracking-[-0.04em]">The next ones are agents.</h2>
            <p className="mt-3 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              Fillmore, a form-filling agent, is the first, and it is live on the Chrome Web Store. The rest are
              concepts for now.{" "}
              <span className="font-semibold text-ink">
                See the agents <span className="nudge">→</span>
              </span>
            </p>
          </div>
        </Link>
      </Reveal>
    </div>
  );
}
