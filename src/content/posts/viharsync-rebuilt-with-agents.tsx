import { Callout, Code, H2, Lede, Quote, Stats, Steps } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "viharsync-rebuilt-with-agents",
  title: "164 commits in seven days: rebuilding ViharSync with coding agents",
  dek: "We chose a stack for AI agents to write, then built guardrails so strict that an agent can’t finish while anything is broken. What that looked like in practice.",
  category: "Building",
  product: "viharsync",
  authors: ["vinit-churi"],
  date: "2026-10-14",
  readingMinutes: 9,
};

export default function Post() {
  return (
    <>
      <Lede>
        ViharSync V1 — Express, MongoDB and Next.js — proved the idea. But a society’s books need guarantees: balanced
        entries, transactions, constraints the database enforces. We wanted those from the ground up, so we rebuilt on
        Postgres — and made an unusual decision about who would write most of the code.
      </Lede>

      <p>The first architecture decision record for V2 says it outright:</p>
      <Quote cite="ADR 0001 — tech stack">
        Coding agents will write most of the code, so the stack is chosen for agent-friendliness… rules encoded as types,
        linters, tests and hooks rather than left to reviewers.
      </Quote>

      <Stats
        items={[
          { value: "164", label: "commits between 8 and 14 October 2026" },
          { value: "~50k", label: "hand-written lines across Go, Dart and TypeScript" },
          { value: "1", label: "command that gates every change: make check" },
        ]}
      />

      <H2>Why Go, why a monolith</H2>
      <p>
        Go was picked for its fast build-and-test loop and its explicitness — an agent reading Go code rarely has to
        guess what happens. The backend is a modular monolith: one binary, with modules for identity, access, society,
        finance, community, gate and amenities. Each module’s public API is its root package; everything else is in an{" "}
        <code>internal/</code> folder that Go itself forbids other modules from importing. An architecture test enforces
        the rest. Modules may read each other’s tables, but only the owning module writes them.
      </p>

      <H2>One contract to rule three clients</H2>
      <p>
        ViharSync has three clients: a resident app and a guard app in Flutter, and a committee console in Next.js. All
        of them, and the server, are generated from a single OpenAPI file — 130 operations today.
      </p>
      <Steps
        items={[
          { title: "Server", body: "oapi-codegen produces a strict Go server interface. A missing handler is a compile error." },
          { title: "Database", body: "sqlc turns hand-written SQL into typed Go. No ORM." },
          { title: "Clients", body: "Dart clients for both Flutter apps, and TypeScript types for the console." },
          { title: "Freshness", body: "Generated files are committed; CI fails if they’re stale, and a hook blocks anyone — human or agent — from hand-editing them." },
        ]}
      />
      <p>And one rule makes the contract do security work, too:</p>
      <Code lang="yaml — contracts/openapi/openapi.yaml">{`
# Every operation must declare one of these, or the server refuses to start.
x-permission: finance.bills.issue
# or
x-public: true
`}</Code>

      <H2>Guardrails only work if they always run</H2>
      <p>
        <code>make check</code> runs codegen, formatting, linting and every test across the backend, both apps and the
        console. It runs in the pre-commit hook, in CI — and in a hook that fires when a coding agent tries to stop.
      </p>
      <Quote cite="ADR 0001">They only work if they always run.</Quote>
      <p>
        In practice that means an agent can’t declare a task done while the build is red. Agents worked in parallel git
        worktrees — finance, gate, community and society landed on the first day as separate branches — and each one had
        to pass the same gate before it merged.
      </p>

      <H2>Tests an agent can’t talk its way past</H2>
      <ul>
        <li>
          <strong>No mocks for SQL.</strong> Integration tests run against real Postgres 18 in containers.
        </li>
        <li>
          <strong>The demo is a test.</strong> A seed command builds a whole society through the public API — wings,
          flats, three months of bills, payments, expenses, complaints, gate traffic — and fails if the books don’t
          balance.
        </li>
        <li>
          <strong>Pixels are pinned.</strong> 110 golden images cover the Flutter UI, plus a live end-to-end test on an
          iOS simulator.
        </li>
        <li>
          <strong>Time is injected.</strong> <code>time.Now()</code> is banned in modules; business time comes from an
          IST app clock, so deadlines are testable regardless of the server’s time zone.
        </li>
      </ul>

      <H2>What the agents were good at — and what they weren’t</H2>
      <p>
        Given a crisp contract and a red-or-green gate, agents were excellent at breadth: whole modules, screens,
        migrations and their tests, in parallel. They were weakest exactly where you’d expect — domain judgement. Which
        rule from the bye-laws applies to a co-operative versus a condominium, what a treasurer actually calls a report,
        why a refuge floor must never be billed. Those came from humans reading research briefs and writing them into
        specs the agents could follow.
      </p>

      <Callout label="Our takeaway">
        <p>
          AI coding agents don’t remove the need for engineering judgement. They move it: out of typing code and into
          contracts, constraints and tests. The tighter those are, the more you can safely delegate.
        </p>
      </Callout>
    </>
  );
}
