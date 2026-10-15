import { H2, Lede, Steps } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "reelforge-free-tier-that-pays",
  title: "A free tier that doesn’t bankrupt you: pricing ReelForge for India and the world",
  dek: "Geo-priced plans in rupees and dollars, payments confirmed twice and activated once, and the quiet cost controls that let a video product offer a free plan at all.",
  category: "Launch",
  product: "reelforge",
  authors: ["vinit-churi", "kenil-joshi"],
  date: "2026-10-14",
  readingMinutes: 7,
};

export default function Post() {
  return (
    <>
      <Lede>
        Video is the most expensive thing you can offer for free. Every upload is storage, every transcript is an API
        call, every export is minutes of CPU. If a free tier is how creators find you, it had better not be the thing
        that sinks you.
      </Lede>

      <H2>Two prices for one product</H2>
      <p>
        A plan that feels cheap in San Francisco is out of reach in Surat. So ReelForge shows prices in rupees to
        visitors in India and in dollars to everyone else. The landing page looks up the visitor’s country, asks the API
        for plans in that currency, and falls back to rupees if the lookup fails. Plans are documents in the database
        with their own currency, not hard-coded numbers, so we can change pricing without a deploy.
      </p>
      <p>
        Under the hood, every amount sent to the payment gateway is an integer in the smallest unit — paise, or cents.
        No floating-point money, anywhere.
      </p>

      <H2>Confirm twice, activate once</H2>
      <p>
        Payments go through Razorpay. The failure we designed for is boring and common: the user pays, then closes the
        tab before the app hears back. So there are two paths to “paid”:
      </p>
      <Steps
        items={[
          { title: "The checkout result", body: "The browser sends the order and payment IDs with Razorpay’s signature; the server verifies it." },
          { title: "The webhook", body: "Razorpay calls us directly on payment.captured, whether or not the browser ever came back." },
          { title: "One function", body: "Both paths call the same idempotent activation. Whichever arrives first upgrades the plan; the second is a no-op." },
        ]}
      />

      <H2>The cost controls nobody sees</H2>
      <p>The free plan exists because of a handful of decisions that keep its cost bounded:</p>
      <ul>
        <li>
          <strong>Free footage expires.</strong> Source videos and thumbnails for free projects are deleted after seven
          days by a scheduled job behind a shared secret, and the project is marked expired.
        </li>
        <li>
          <strong>Free B-roll stays in your browser.</strong> Assets you add on the free plan live in IndexedDB on your
          machine and are only sent with an export. Paid plans store them in the cloud so they follow you between
          devices.
        </li>
        <li>
          <strong>Paid features are enforced on the server.</strong> Audio layers and watermark removal are checked in
          the backend, even if the browser sends them. The client is never trusted with the price list.
        </li>
        <li>
          <strong>Failures are refunded.</strong> An upload that fails or has no speech gives its slot back.
        </li>
      </ul>

      <H2>Measuring the funnel without fooling ourselves</H2>
      <p>
        We use PostHog for product analytics, routed through our own <code>/ingest</code> path so it isn’t silently
        dropped by ad blockers. The two funnels we watch are the ones that matter for a small paid product: the video
        workflow — upload, transcript, editor, export — and payment conversion, from opening the upgrade dialog to a
        verified payment.
      </p>


      <H2>The long-term fix for cost</H2>
      <p>
        All of this manages a basic fact: server-side rendering makes every free export cost us money. The real fix is
        to stop rendering on our servers at all — which is why we spent a month running 39 experiments on an editor that
        runs entirely in your browser.
      </p>
    </>
  );
}
