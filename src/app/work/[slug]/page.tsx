import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/people";
import { PostRow } from "@/components/post-row";
import { ProductTile } from "@/components/product-row";
import { Reveal } from "@/components/reveal";
import { postsForProduct } from "@/content/posts";
import { getProduct, products } from "@/content/products";
import { getPerson } from "@/content/team";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, productSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return pageMetadata({
    title: `${product.name} — ${product.kicker.split(" · ")[0]}`,
    description: product.oneLiner,
    path: `/work/${product.slug}`,
    image: { url: `/work/${product.slug}/opengraph-image`, alt: `${product.name} — ${product.oneLiner}` },
    keywords: [product.name, ...product.kicker.split(" · "), ...product.stack],
  });
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="font-serif text-[2.5rem] leading-tight italic">{children}</h2>;
}

export default async function ProductPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const related = postsForProduct(product.slug);
  const index = products.findIndex((p) => p.slug === product.slug);
  const next = products[(index + 1) % products.length];

  return (
    <article>
      <JsonLd
        data={[
          productSchema(product),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Work", path: "/work" },
            { name: product.name, path: `/work/${product.slug}` },
          ]),
        ]}
      />
      {/* HERO */}
      <header className="mx-auto max-w-[1120px] px-6 pt-12 sm:pt-16">
        <Link href="/work" className="group inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-ink">
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span> All work
        </Link>
        <div className="mt-8 grid items-end gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="order-2 lg:order-1">
            <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-muted">
              <span>{product.kicker}</span>
              <span>{product.credit}</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[#2f9e6a] text-[#2f9e6a]" aria-hidden />
                {product.status}
              </span>
            </p>
            <h1 className="mt-4 text-[clamp(3.5rem,9vw,7.5rem)] leading-[0.9] font-bold tracking-[-0.055em]">
              {product.name}
            </h1>
            <p className="mt-6 font-serif text-[1.75rem] leading-snug text-ink italic">{product.oneLiner}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={product.url}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex min-h-12 items-center gap-2 rounded-full px-6 font-semibold transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: product.color, color: product.onColor }}
              >
                {product.urlLabel} <span className="nudge">↗</span>
              </a>
              {related.length > 0 && (
                <a
                  href="#writing"
                  className="inline-flex min-h-12 items-center rounded-full border border-line px-6 font-semibold transition-colors hover:border-ink"
                >
                  Read {related.length} {related.length === 1 ? "post" : "posts"}
                </a>
              )}
            </div>
          </div>
          <ProductTile product={product} className="order-1 h-[300px] sm:h-[420px] lg:order-2" />
        </div>
      </header>

      <div className="mx-auto max-w-[1120px] px-6">
        {/* SUMMARY + PROBLEM */}
        <section className="grid gap-12 pt-28 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <SectionLabel>The problem</SectionLabel>
          </Reveal>
          <Reveal delay={100} className="space-y-5 text-[1.1875rem] leading-relaxed text-ink-soft">
            <p className="text-[1.375rem] leading-normal text-ink">{product.summary}</p>
            {product.problem.map((para) => (
              <p key={para}>{para}</p>
            ))}
          </Reveal>
        </section>

        {/* NUMBERS */}
        <Reveal className="pt-20">
          <dl className="grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-3">
            {product.numbers.map((n) => (
              <div key={n.label} className="bg-paper p-7">
                <dt className="sr-only">{n.label}</dt>
                <dd className="text-[3rem] leading-none font-bold tracking-[-0.05em]">{n.value}</dd>
                <dd className="mt-3 text-[15px] leading-snug text-muted">{n.label}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* HOW IT WORKS */}
        <section className="pt-28">
          <Reveal>
            <SectionLabel>How it works</SectionLabel>
          </Reveal>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.how.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                delay={i * 60}
                className="group rounded-3xl border border-line p-6 transition-colors duration-300 hover:border-ink"
              >
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:rotate-[-8deg] group-hover:scale-110"
                  style={{ background: product.color, color: product.onColor }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl font-bold tracking-[-0.02em]">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{step.body}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* DECISIONS */}
        <section className="grid gap-12 pt-28 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <SectionLabel>Decisions I’d make again</SectionLabel>
          </Reveal>
          <div className="divide-y divide-line border-y border-line">
            {product.decisions.map((d, i) => (
              <Reveal key={d.title} delay={i * 60} className="py-6">
                <h3 className="text-xl font-bold tracking-[-0.02em]">{d.title}</h3>
                <p className="mt-2 text-[17px] leading-relaxed text-ink-soft">{d.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* JOURNEY */}
        <section className="pt-28">
          <Reveal>
            <SectionLabel>The journey so far</SectionLabel>
            <p className="mt-3 max-w-xl text-[17px] text-muted">
              From the first annoyance to telling people about it. Dates come from the commit history.
            </p>
          </Reveal>
          <ol className="relative mt-12 ml-3 border-l border-line">
            {product.journey.map((entry, i) => (
              <Reveal as="li" key={entry.title} delay={Math.min(i, 4) * 50} className="group relative pb-10 pl-8 last:pb-0">
                <span
                  aria-hidden
                  className={`absolute top-1.5 -left-[7px] h-3.5 w-3.5 rounded-full border-2 transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-150 ${
                    entry.next ? "border-dashed border-ink/50 bg-paper" : "border-paper"
                  }`}
                  style={entry.next ? undefined : { background: product.color, boxShadow: "0 0 0 1px var(--color-ink)" }}
                />
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
                  {entry.date && <span>{entry.date}</span>}
                  <span className="rounded-full border border-line px-2 py-0.5">{entry.stage}</span>
                  {entry.next && <span className="text-accent">Next</span>}
                </p>
                <h3 className={`mt-2 text-xl font-bold tracking-[-0.02em] ${entry.next ? "text-ink-soft" : ""}`}>
                  {entry.title}
                </h3>
                <p className="mt-1.5 max-w-2xl text-[17px] leading-relaxed text-ink-soft">{entry.body}</p>
              </Reveal>
            ))}
          </ol>
        </section>

        {/* TEAM + STACK */}
        <section className="grid gap-12 pt-28 sm:grid-cols-2">
          <Reveal>
            <h2 className="font-mono text-xs text-muted">Built by</h2>
            <ul className="mt-5 space-y-4">
              {product.builtBy.map((slug) => {
                const person = getPerson(slug);
                return (
                  <li key={slug}>
                    <Link href={`/about#${slug}`} className="group flex items-center gap-4">
                      <Avatar slug={slug} size={48} />
                      <span className="text-lg font-semibold">
                        <span className="link-draw">{person.name}</span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Reveal>
          <Reveal delay={100}>
            <h2 className="font-mono text-xs text-muted">Built with</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {product.stack.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line px-4 py-2 text-[15px] transition-colors duration-300 hover:border-ink"
                >
                  {s}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* WRITING */}
        {related.length > 0 && (
          <section id="writing" className="scroll-mt-24 pt-28">
            <Reveal>
              <SectionLabel>Writing about {product.name}</SectionLabel>
            </Reveal>
            <Reveal className="mt-6">
              <ul>
                {related.map((post) => (
                  <PostRow key={post.slug} post={post} />
                ))}
              </ul>
            </Reveal>
          </section>
        )}

        {/* NEXT */}
        <Reveal className="pt-28">
          <Link
            href={`/work/${next.slug}`}
            className="group flex items-center justify-between gap-6 rounded-3xl p-8 transition-transform duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 sm:p-12"
            style={{ background: next.color, color: next.onColor }}
          >
            <span>
              <span className="font-mono text-xs opacity-75">Next story</span>
              <span className="mt-2 block text-[clamp(2.5rem,6vw,4.5rem)] leading-none font-bold tracking-[-0.05em]">
                {next.name}
              </span>
            </span>
            <span aria-hidden className="nudge text-5xl">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </article>
  );
}
