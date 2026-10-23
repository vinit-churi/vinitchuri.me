import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { products } from "@/content/products";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "Now",
  description:
    "What Vinit Churi is working on this month across TraceSarkar, Hookline, ReelForge, Fillmore and infoyantra — and what’s next for each.",
  path: "/now",
});

const updated = "23 October 2026";

export default function NowPage() {
  return (
    <div className="mx-auto max-w-[760px] px-6 pt-20 sm:pt-28">
      <header>
        <p className="animate-[fade-lift_700ms_var(--ease-out-soft)_both] font-mono text-xs text-muted">
          Updated {updated}
        </p>
        <h1 className="mt-4 animate-[fade-lift_700ms_var(--ease-out-soft)_80ms_both] font-serif text-[clamp(4rem,12vw,8rem)] leading-[0.9] italic">
          Now
        </h1>
        <p className="mt-6 animate-[fade-lift_700ms_var(--ease-out-soft)_160ms_both] text-xl leading-relaxed text-ink-soft">
          A <a href="https://nownownow.com/about" className="text-accent underline underline-offset-4">now page</a>: what
          each of my products is actually doing this month, and what’s next. If it’s not here, I’m not working on it.
        </p>
        <p className="mt-4 animate-[fade-lift_700ms_var(--ease-out-soft)_200ms_both] text-lg leading-relaxed text-ink-soft">
          Through November most of my time goes to preparing for an exam, so building happens in a short slot each
          day. The Filing agent for TraceSarkar is out; infoyantra is next.
        </p>
      </header>

      <ol className="mt-16 space-y-4">
        {products.map((p, i) => {
          const next = p.journey.find((j) => j.next);
          return (
            <Reveal as="li" key={p.slug} delay={i * 80}>
              <Link
                href={`/work/${p.slug}`}
                className="group block overflow-hidden rounded-3xl border border-line transition-[border-color,transform] duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-ink"
              >
                <div className="flex items-center justify-between gap-4 px-6 py-4" style={{ background: p.color, color: p.onColor }}>
                  <span className="text-xl font-bold tracking-[-0.03em]">{p.name}</span>
                  <span className="font-mono text-xs">{p.status}</span>
                </div>
                <div className="space-y-4 p-6">
                  <p className="text-lg leading-snug">{p.now}</p>
                  {next && (
                    <p className="text-[15px] leading-relaxed text-muted">
                      <span className="font-mono text-xs text-accent">Next · {next.stage}</span>
                      <br />
                      {next.title}. {next.body}
                    </p>
                  )}
                  <span className="inline-block text-[15px] font-semibold">
                    The whole journey <span className="nudge">→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
        <Reveal as="li" delay={240}>
          <div className="rounded-3xl border border-dashed border-ink/30 p-6">
            <p className="font-mono text-xs text-muted">Live</p>
            <p className="mt-2 text-lg leading-snug">
              <Link href="/agents/fillmore" className="text-accent underline underline-offset-4">
                Fillmore
              </Link>
              , a form-filling agent for your browser, is live on the Chrome Web Store at v0.8.1: a history of forms
              you send, screening answers remembered, and filling automatically on sites you choose. The build notes
              are in{" "}
              <Link href="/writing" className="text-accent underline underline-offset-4">
                Writing
              </Link>
              .
            </p>
          </div>
        </Reveal>
      </ol>
    </div>
  );
}
