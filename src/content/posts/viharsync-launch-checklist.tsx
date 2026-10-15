import { Callout, H2, Lede, Steps } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "viharsync-launch-checklist",
  title: "Everything between a working app and a launched one",
  dek: "ViharSync V2 runs end to end on a demo society. Here is the honest list of what still stands between that and real money moving through it.",
  category: "Launch",
  product: "viharsync",
  authors: ["vinit-churi", "kenil-joshi", "abhilash-pal", "abhishek"],
  date: "2026-10-14",
  readingMinutes: 6,
};

export default function Post() {
  return (
    <>
      <Lede>
        Engineers love the day the demo works. Users don’t care about that day at all. For a product that handles other
        people’s money and personal data, the distance between “works on the demo” and “launched” is mostly paperwork,
        accounts and trust — and nobody writes about it. So here’s ours, in public.
      </Lede>

      <p>
        Today, ViharSync V2 runs a full demo society — Shreeniwas CHS — end to end: billing, payments through a mock
        gateway, receipts, complaints, gate traffic, statements. Anyone can sign in as a demo user. That last sentence is
        exactly why it isn’t launched yet.
      </p>

      <H2>The launch checklist</H2>
      <Steps
        items={[
          {
            title: "Live payments",
            body: "“Pay now” uses a mock gateway in development. Real money needs a Razorpay live account, business KYC, live keys, the webhook configured — and one small real payment tested end to end, including a refund. Production already refuses to start without real keys.",
          },
          {
            title: "SMS that actually arrives",
            body: "Login is by phone OTP. In India that means MSG91, DLT entity and template registration, and checking delivery across Jio, Airtel and Vi — not just one test phone.",
          },
          {
            title: "Android, properly",
            body: "Most residents use Android, often on low-end phones. Both apps need full Android builds, checked against the payment, PDF and secure-storage plugins, on a cheap device.",
          },
          {
            title: "Hosting with a tested restore",
            body: "The target is a small, boring setup in Mumbai’s cloud region with a managed Postgres — and backups we’ve actually restored from, not just configured.",
          },
          {
            title: "Store releases",
            body: "Developer accounts, icons, screenshots, listings, privacy policy and data-safety forms for two apps on two stores.",
          },
          {
            title: "DPDP basics",
            body: "Residents’ personal data falls under India’s DPDP Act 2023: a privacy policy, terms, consent text at login and a data-retention statement.",
          },
          {
            title: "A security review",
            body: "Money plus personal data means auth, tenancy and payment flows get reviewed, dependencies audited, and rate limits set at the edge.",
          },
        ]}
      />

      <H2>Why we’re writing this down</H2>
      <p>
        Two reasons. First, it keeps us honest: a public list is harder to quietly shorten. Second, nearly every small
        team building for Indian users hits the same wall — KYC, DLT, store forms, data-protection text — and the
        knowledge is scattered across forum threads. If this list saves someone a week, good.
      </p>

      <H2>How we’ll take it to societies</H2>
      <p>
        Our bet is that societies don’t buy software from a website — a committee member hears about it from another
        committee member. So the plan for V2 is unglamorous: make onboarding a society — wings, flats, charge heads —
        take minutes with the building builder, put a real treasurer through a real month-end close, and let that close
        be the demo they show the next committee.
      </p>

      <Callout label="Follow along">
        <p>
          We’ll post again when each item is ticked off — including what went wrong. The Now page always has the current
          state.
        </p>
      </Callout>
    </>
  );
}
