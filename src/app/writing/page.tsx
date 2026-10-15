import type { Metadata } from "next";
import Link from "next/link";
import { Byline } from "@/components/people";
import { WritingIndex } from "@/components/writing-index";
import { formatDate, posts } from "@/content/posts";
import { getProduct } from "@/content/products";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { blogSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "Writing",
  description:
    "Engineering deep dives and launch notes by Vinit Churi: spatial joins with PostGIS, double-entry ledgers in paise, FFmpeg render pipelines, in-browser video with WebGPU, and building with AI coding agents.",
  path: "/writing",
  keywords: ["engineering blog", "building in public", "PostGIS", "FFmpeg", "WebGPU", "AI coding agents"],
});

export default function WritingPage() {
  const [featured, ...rest] = posts;
  const product = featured.product ? getProduct(featured.product) : undefined;
  const metas = rest.map((p) => ({
    slug: p.slug,
    title: p.title,
    dek: p.dek,
    category: p.category,
    product: p.product,
    authors: p.authors,
    date: p.date,
    readingMinutes: p.readingMinutes,
  }));

  return (
    <div className="mx-auto max-w-[1120px] px-6 pt-20 sm:pt-28">
      <JsonLd
        data={[
          blogSchema(posts),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Writing", path: "/writing" },
          ]),
        ]}
      />
      <header className="max-w-3xl">
        <p className="animate-[fade-lift_700ms_var(--ease-out-soft)_both] font-mono text-xs text-muted">Writing</p>
        <h1 className="mt-4 animate-[fade-lift_700ms_var(--ease-out-soft)_80ms_both] text-[clamp(2.75rem,6.4vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.05em]">
          Notes from the build<span className="text-accent">.</span>
        </h1>
        <p className="mt-8 animate-[fade-lift_700ms_var(--ease-out-soft)_160ms_both] text-xl leading-relaxed text-ink-soft">
          How the products work, why I made the calls I did, and what it takes to launch them — including the parts
          most teams leave out.
        </p>
      </header>

      <Link
        href={`/writing/${featured.slug}`}
        className="group mt-16 block animate-[fade-lift_700ms_var(--ease-out-soft)_240ms_both] rounded-3xl bg-paper-deep p-8 transition-colors duration-300 hover:bg-[#ebe7dc] sm:p-12"
      >
        <p className="flex items-center gap-2 font-mono text-xs text-muted">
          {product && <span className="h-2 w-2 rounded-full" style={{ background: product.color }} aria-hidden />}
          Start here · {featured.category}
        </p>
        <h2 className="mt-4 max-w-3xl text-[clamp(2rem,4vw,3.25rem)] leading-[1.02] font-bold tracking-[-0.045em] transition-colors group-hover:text-accent">
          {featured.title}
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-soft">{featured.dek}</p>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 text-[15px] text-muted">
          <Byline authors={featured.authors} linked={false} />
          <span className="font-mono text-xs">
            {formatDate(featured.date)} · {featured.readingMinutes} min
          </span>
        </div>
      </Link>

      <div className="mt-20">
        <WritingIndex posts={metas} />
      </div>
    </div>
  );
}
