import Link from "next/link";
import type { Agent } from "@/content/agents";
import { site } from "@/content/site";

const statusDot: Record<Agent["status"], string> = {
  "In the lab": "#6C63FF",
  Concept: "#A8A498",
};

const cardClass =
  "flex w-full min-h-[280px] flex-col gap-5 rounded-3xl border p-6 transition-[transform,border-color] duration-500 ease-[var(--ease-out-soft)]";

export function AgentCard({ agent }: { agent: Agent }) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-extrabold tracking-[-0.03em] transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:rotate-[-6deg]"
          style={{ background: agent.tint }}
          aria-hidden
        >
          {agent.mark}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-xs text-ink-soft">
          <span className="h-[7px] w-[7px] rounded-full" style={{ background: statusDot[agent.status] }} aria-hidden />
          {agent.status}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs text-muted">{agent.kicker}</p>
        <h3 className="text-[1.75rem] leading-[1.05] font-bold tracking-[-0.04em]">{agent.name}</h3>
        <p className="text-base leading-normal text-ink-soft">{agent.oneLiner}</p>
      </div>
      {agent.href && (
        <span className="mt-auto text-[15px] font-semibold">
          Meet {agent.name} <span className="nudge">→</span>
        </span>
      )}
    </>
  );
  const className = `${cardClass} group border-line bg-white hover:-translate-y-1 hover:border-ink`;
  return agent.href ? (
    <Link href={agent.href} className={className}>
      {body}
    </Link>
  ) : (
    <article className={className}>{body}</article>
  );
}

/** The last card in the grid: an open invitation to pitch the next agent. */
export function PitchCard() {
  return (
    <a
      href={`mailto:${site.email}?subject=${encodeURIComponent("An agent idea")}`}
      className={`${cardClass} group border-dashed border-line bg-paper-deep hover:-translate-y-1 hover:border-ink`}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink text-2xl font-bold text-paper transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:rotate-90"
          aria-hidden
        >
          +
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-xs text-ink-soft">
          <span className="h-[7px] w-[7px] rounded-full bg-ink" aria-hidden />
          Open
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-mono text-xs text-muted">Open slot</p>
        <h3 className="text-[1.75rem] leading-[1.05] font-bold tracking-[-0.04em]">Your problem?</h3>
        <p className="text-base leading-normal text-ink-soft">
          Tell me a job you’d hand to an agent. The good ones become the next card here.
        </p>
      </div>
      <span className="mt-auto text-[15px] font-semibold">
        Pitch me <span className="nudge">→</span>
      </span>
    </a>
  );
}
