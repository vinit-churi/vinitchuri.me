import type { Metadata } from "next";
import Link from "next/link";
import { Avatar } from "@/components/people";
import { Reveal } from "@/components/reveal";
import { getProduct, productHref } from "@/content/products";
import { site } from "@/content/site";
import { getPerson, team } from "@/content/team";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { aboutSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description:
    "Vinit Churi is an engineer in Mumbai. He built TraceSarkar and is building Fillmore on his own, builds ReelForge and Hookline with Kenil Joshi, and is part of Logicvell.",
  path: "/about",
  keywords: ["Vinit Churi", "engineer Mumbai", "Kenil Joshi", "Logicvell"],
});

const principles = [
  {
    title: "Real problem first",
    body: "If I can’t name who it hurts — ideally myself — I don’t build it.",
  },
  {
    title: "Read before I write",
    body: "Court judgments, bye-laws, data sources, 39 experiments. Research is the cheapest place to be wrong.",
  },
  {
    title: "AI where it earns it",
    body: "Agents help me build fast; models read photos and speech. They never write a fact about a named person.",
  },
  {
    title: "The boring parts are the product",
    body: "Integer paise, balanced ledgers, deterministic PDFs, snapped locations. Trust is built from details.",
  },
  {
    title: "Tell people, honestly",
    body: "I publish how it works, what it costs, and what went wrong — dated, in public.",
  },
];

function ProductChips({ slugs }: { slugs: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {slugs.map((slug) => {
        const product = getProduct(slug)!;
        return (
          <li key={slug}>
            <Link
              href={productHref(product)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm transition-colors hover:border-ink"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: product.color }} aria-hidden />
              {product.name}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default function AboutPage() {
  const me = getPerson("vinit-churi");
  const others = team.filter((p) => p.slug !== me.slug);

  return (
    <div className="mx-auto max-w-[1120px] px-6 pt-20 sm:pt-28">
      <JsonLd
        data={[
          aboutSchema(),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />
      <header id={me.slug} className="max-w-4xl scroll-mt-28">
        <p className="animate-[fade-lift_700ms_var(--ease-out-soft)_both] font-mono text-xs text-muted">About</p>
        <h1 className="mt-4 animate-[fade-lift_700ms_var(--ease-out-soft)_80ms_both] text-[clamp(2.75rem,6.4vw,5.5rem)] leading-[0.95] font-bold tracking-[-0.05em]">
          One engineer. <span className="font-serif font-normal tracking-[-0.02em] italic">One habit.</span>
        </h1>
        <div className="mt-8 animate-[fade-lift_700ms_var(--ease-out-soft)_160ms_both] space-y-5 text-xl leading-relaxed text-ink-soft">
          <p>
            I’m Vinit Churi, an engineer in {site.city}. I don’t pick a market first. I pick a problem that won’t leave
            me alone — a pothole nobody owns, an hour lost timing captions, a reel nobody can explain, a form with 47
            fields — and I build until it’s fixed.
          </p>
          <p>
            TraceSarkar and Fillmore are mine alone. ReelForge and Hookline I build with Kenil Joshi. I’m also part of{" "}
            <a href="https://logicvell.com" className="text-accent underline underline-offset-4">
              Logicvell
            </a>
            , where I led the ViharSync V2 rebuild.
          </p>
        </div>
        <ProductChips slugs={me.products} />
      </header>

      <section className="pt-28">
        <Reveal>
          <h2 className="font-serif text-[2.5rem] italic">People I build with</h2>
          <p className="mt-2 text-[15px] text-muted">Their names are on the work we did together.</p>
        </Reveal>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {others.map((person, i) => (
            <Reveal
              as="li"
              key={person.slug}
              delay={i * 70}
              className="group scroll-mt-28 rounded-3xl border border-line p-7 transition-[border-color,transform] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-ink"
            >
              <div id={person.slug} className="flex items-center gap-4">
                <span className="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:rotate-[-6deg]">
                  <Avatar slug={person.slug} size={64} />
                </span>
                <div>
                  <h3 className="text-2xl font-bold tracking-[-0.03em]">{person.name}</h3>
                  <p className="font-mono text-xs text-muted">{person.role}</p>
                </div>
              </div>
              <p className="mt-5 text-[17px] leading-relaxed text-ink-soft">{person.bio}</p>
              <ProductChips slugs={person.products} />
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="pt-28">
        <Reveal>
          <h2 className="font-serif text-[2.5rem] italic">How I work</h2>
        </Reveal>
        <ol className="mt-10 divide-y divide-line border-y border-line">
          {principles.map((p, i) => (
            <Reveal
              as="li"
              key={p.title}
              delay={i * 50}
              className="group grid gap-2 py-6 sm:grid-cols-[4rem_1fr_1.4fr] sm:items-baseline sm:gap-6"
            >
              <span className="font-mono text-sm text-accent">0{i + 1}</span>
              <h3 className="text-xl font-bold tracking-[-0.02em] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:translate-x-1">
                {p.title}
              </h3>
              <p className="text-[17px] leading-relaxed text-ink-soft">{p.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="pt-28">
        <Reveal>
          <div className="rounded-3xl bg-accent p-8 text-paper sm:p-14">
            <h2 className="text-[clamp(2.25rem,5vw,4rem)] leading-[0.98] font-bold tracking-[-0.05em]">
              Got a problem worth building for?
            </h2>
            <p className="mt-4 max-w-xl text-lg text-paper/80">
              Ideas, collaborations, press, or an agent you wish existed — I read everything.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="group mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-paper px-6 font-semibold text-ink transition-transform duration-300 hover:-translate-y-0.5"
            >
              {site.email} <span className="nudge">→</span>
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
