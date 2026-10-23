import type { Metadata } from "next";
import Link from "next/link";
import { AgentCard, PitchCard } from "@/components/agent-card";
import { Avatar } from "@/components/people";
import { PostRow } from "@/components/post-row";
import { ProductRow } from "@/components/product-row";
import { Reveal } from "@/components/reveal";
import { RotatingWord } from "@/components/rotating-word";
import { agents, agentSteps } from "@/content/agents";
import { posts } from "@/content/posts";
import { products, stages } from "@/content/products";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} — ${site.tagline.toLowerCase()}`,
  absoluteTitle: true,
  description: site.description,
  path: "/",
});

const stageCopy: Record<(typeof stages)[number], string> = {
  "Get annoyed": "A real problem, ideally one I live next to.",
  Research: "Laws, data, users, and everything that’s been tried.",
  Build: "Small and strict, with the newest AI that genuinely fits.",
  Ship: "In front of real people early — then fix what they find.",
  "Tell people": "Marketing is part of the build. I write it all up.",
};

export default function Home() {
  return (
    <>
      {/* INTRO */}
      <section className="mx-auto max-w-[1120px] px-6 pt-20 sm:pt-28">
        <h1 className="text-[clamp(3.25rem,8.8vw,8.25rem)] leading-[0.92] font-bold tracking-[-0.055em]">
          <span className="block animate-[fade-lift_800ms_var(--ease-out-soft)_both]">
            Hi, I’m Vinit<span className="text-accent">.</span>
          </span>
          <span className="block animate-[fade-lift_800ms_var(--ease-out-soft)_150ms_both] font-serif font-normal tracking-[-0.02em] text-muted italic">
            I build things that <RotatingWord words={["work.", "ship.", "last.", "matter."]} />
          </span>
        </h1>

        <div className="mt-16 grid items-start gap-12 sm:grid-cols-2">
          <Reveal>
            <p className="text-[1.375rem] leading-normal tracking-[-0.01em]">
              An engineer who keeps running into problems that annoy me — then building my way out of them. Some
              become <a href="#made" className="link-draw font-semibold">products</a>, each its own story. More and
              more become <a href="#agents" className="link-draw font-semibold">agents</a> that do one job end to end
              and hand the result back to you.
            </p>
          </Reveal>
          <Reveal delay={120} className="flex flex-col gap-4">
            <Link href="/about" className="group flex w-fit items-center gap-4" aria-label="About Vinit">
              <Avatar slug="vinit-churi" size={56} />
              <span className="text-[15px] font-semibold">
                About me <span className="nudge">→</span>
              </span>
            </Link>
            <p className="text-[15px] leading-relaxed text-muted">
              Based in {site.city}. Some things I build alone, some with friends. I write about all of it — the code,
              the launches, the marketing, the mistakes.
            </p>
          </Reveal>
        </div>
      </section>

      {/* MADE */}
      <section id="made" className="mx-auto max-w-[1120px] scroll-mt-24 px-6 pt-36">
        <Reveal className="mb-8 flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-[2.5rem] tracking-[-0.01em] italic">Things I’ve made</h2>
          <Link href="/work" className="link-draw text-[15px] font-semibold">
            All work
          </Link>
        </Reveal>
        <div className="border-b border-line">
          {products.map((product, i) => (
            <Reveal key={product.slug} delay={i * 60}>
              <ProductRow product={product} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* AGENTS */}
      <section id="agents" className="mx-auto max-w-[1120px] scroll-mt-24 px-6 pt-36">
        <Reveal className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <h2 className="font-serif text-[2.5rem] leading-[1.05] tracking-[-0.01em] italic">
            Agents
            <br />
            <span className="text-muted">— what I’m making</span>
          </h2>
          <p className="max-w-sm text-[15px] leading-relaxed text-muted">
            Autonomous agents built on new AI. Each does one job end to end, then hands it to a person. Fillmore is
            out on the Chrome Web Store; the Filing agent for TraceSarkar is being built now.
          </p>
        </Reveal>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, i) => (
            <Reveal as="li" key={agent.slug} delay={(i % 3) * 60} className="flex">
              <AgentCard agent={agent} />
            </Reveal>
          ))}
          <Reveal as="li" delay={120} className="flex">
            <PitchCard />
          </Reveal>
        </ul>

        <div className="grid items-start gap-12 pt-28 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-serif text-[2.5rem] italic">How my agents work</h2>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-ink-soft">
              Same shape every time, whatever the job. An agent I can’t explain in five steps isn’t ready to ship.
            </p>
          </Reveal>
          <ol className="border-t border-ink">
            {agentSteps.map((step, i) => (
              <Reveal
                as="li"
                key={step.title}
                delay={i * 60}
                className="group grid grid-cols-[56px_1fr] gap-4 border-b border-line py-5"
              >
                <span className="text-4xl leading-none font-extrabold tracking-[-0.05em] text-accent transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1">
                  {i + 1}
                </span>
                <span>
                  <strong className="text-lg">{step.title}</strong>
                  <span className="mt-1 block text-[15px] leading-normal text-muted">{step.body}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* HOW */}
      <section className="mx-auto max-w-[1120px] px-6 pt-36">
        <Reveal>
          <h2 className="mb-10 font-serif text-[2.5rem] italic">How a product happens here</h2>
        </Reveal>
        <ol className="grid gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {stages.map((stage, i) => (
            <Reveal as="li" key={stage} delay={i * 80} className="group flex flex-col gap-2.5">
              <span className="text-[3.5rem] leading-none font-extrabold tracking-[-0.05em] text-accent transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1.5">
                {i + 1}
              </span>
              <strong className="text-lg">{stage}</strong>
              <span className="text-[15px] leading-normal text-muted">{stageCopy[stage]}</span>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* WRITING */}
      <section className="mx-auto max-w-[1120px] px-6 pt-36">
        <Reveal className="mb-6 flex items-baseline justify-between gap-4">
          <h2 className="font-serif text-[2.5rem] italic">Writing</h2>
          <Link href="/writing" className="link-draw text-[15px] font-semibold">
            Everything ({posts.length})
          </Link>
        </Reveal>
        <Reveal>
          <ul>
            {posts.slice(0, 5).map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </ul>
        </Reveal>
      </section>

      {/* NOW */}
      <section className="mx-auto max-w-[1120px] px-6 pt-36">
        <Reveal>
          <Link
            href="/now"
            className="group grid gap-10 rounded-3xl bg-ink p-8 text-paper transition-transform duration-500 ease-[var(--ease-out-soft)] hover:-translate-y-1 sm:grid-cols-2 sm:p-14"
          >
            <div>
              <h2 className="font-serif text-5xl italic">Now</h2>
              <p className="mt-2 font-mono text-xs text-[#A8A498]">What I’m working on this month</p>
              <span className="mt-8 inline-block text-[15px] font-semibold">
                The full list <span className="nudge">→</span>
              </span>
            </div>
            <ul className="flex flex-col gap-4 text-lg leading-snug">
              {products.map((p) => (
                <li key={p.slug} className="flex gap-3.5">
                  <span style={{ color: p.slug === "hookline" ? "#FF5A1F" : p.color }} aria-hidden>
                    ●
                  </span>
                  <span>
                    <strong className="font-semibold">{p.name}:</strong> {p.now}
                  </span>
                </li>
              ))}
              <li className="flex gap-3.5">
                <span className="text-[#8E86FF]" aria-hidden>
                  ●
                </span>
                <span>
                  <strong className="font-semibold">Fillmore:</strong> my form-filling agent is live on the Chrome Web
                  Store, free.
                </span>
              </li>
            </ul>
          </Link>
        </Reveal>
      </section>

      {/* CONTACT */}
      <section className="mx-auto max-w-[1120px] px-6 pt-36">
        <Reveal>
          <p className="text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.98] font-bold tracking-[-0.05em]">
            Have a problem that needs building?{" "}
            <a
              href={`mailto:${site.email}`}
              className="group inline-block font-serif font-normal tracking-[-0.02em] text-accent italic"
            >
              Write to me<span className="nudge">.</span>
            </a>
          </p>
        </Reveal>
      </section>
    </>
  );
}
