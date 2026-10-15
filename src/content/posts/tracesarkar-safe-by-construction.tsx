import { Callout, H2, Lede, Quote, Steps } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "tracesarkar-safe-by-construction",
  title: "Safe by construction: privacy engineering for a civic app on a zero budget",
  dek: "Faces destroyed before any model sees them, locations snapped instead of jittered, and database constraints that make the unsafe path impossible rather than unlikely.",
  category: "Building",
  product: "tracesarkar",
  authors: ["vinit-churi"],
  date: "2026-10-14",
  readingMinutes: 9,
};

export default function Post() {
  return (
    <>
      <Lede>
        A photograph of a pothole is rarely just a pothole. There’s a scooter rider in it, a number plate, a shopfront,
        and — implied by the GPS — the place where the person taking it lives or works. TraceSarkar publishes evidence.
        So privacy couldn’t be a feature; it had to be a property of the pipeline.
      </Lede>
      <p>
        Our rule of thumb: don’t write code that checks whether something is safe. Write code where the unsafe version
        can’t be expressed.
      </p>

      <H2>Redact before anyone else looks</H2>
      <p>
        Order matters. Redaction runs <strong>before</strong> classification, so no face ever reaches a third-party
        model. That ruled out cloud vision APIs for detection, so both detectors run in our own binary:
      </p>
      <ul>
        <li>
          <strong>Faces</strong> — the Pico cascade via the MIT-licensed <code>pigo</code> library, embedded at build time.
        </li>
        <li>
          <strong>Number plates</strong> — a small, homegrown multi-scale edge-density localiser.
        </li>
      </ul>
      <p>
        Detected regions are mosaicked — destroyed — not blurred, because blur can sometimes be reversed. Each box is
        padded about an eighth past its edge, because detectors are tight and faces are not. And an image is{" "}
        <em>held</em> unless both detectors can account for it.
      </p>

      <H2>A record, not a flag</H2>
      <p>
        The easy design is a boolean: <code>redacted = true</code>. The trouble with flags is that someone can set one.
        Instead, every public image must point to a redaction record, and a database CHECK constraint refuses a
        “published” verdict that has no output object. There is no code path that produces a public image without a
        redaction behind it.
      </p>

      <H2>Snap, never jitter</H2>
      <p>
        Public maps need to show roughly where a problem is without revealing exactly where the reporter stood. The
        standard trick is to add random noise to the coordinates. We don’t:
      </p>
      <Quote cite="D122">
        Publish the same point enough times with a fresh offset each time and the mean converges on the truth.
      </Quote>
      <p>
        Public positions are snapped to a fixed 0.001° grid — about 111 metres. Snapping is idempotent: a hundred reports
        from one doorstep reveal exactly as much as one. And the public history type has no actor field at all, so
        there’s nothing to accidentally serialise.
      </p>

      <H2>Measure the thing you’re afraid of</H2>
      <p>
        Redaction quality is usually reported as IoU or recall percentages. We measure destroyed pixels, and we print a
        dash rather than 100% when the set is empty:
      </p>
      <Quote cite="D133">“98% recall” reads as a pass; “one face published” reads as what it is.</Quote>
      <p>
        Which brings us to the honest part. Our labelled set of real captures doesn’t contain a face or a plate yet, so
        redaction recall is <strong>unmeasured</strong>. We’ve said so on the methodology page, the project owner has
        explicitly accepted that risk for the pilot, and the set grows with every real capture.
      </p>

      <H2>The mistakes we made on the way</H2>
      <p>Privacy-by-construction is a goal, not a guarantee. A few things we got wrong and fixed:</p>
      <Steps
        items={[
          {
            title: "2,387 phone numbers",
            body: "BMC’s roads API returned representatives’ personal mobile numbers. Our blocklist named the wrong fields, so they were stored. We scrubbed them in a migration, and a test now asserts the blocklist names fields the source actually returns.",
          },
          {
            title: "A briefly public bucket",
            body: "The archive bucket was public for a short window and served a capture without authentication. It’s private and locked now, and downloads live in a separate bucket.",
          },
          {
            title: "One account for everyone",
            body: "For a while every capture was filed under one shared account. The middleware verified the session; the handler ignored it.",
          },
          {
            title: "Blind to big plates",
            body: "The plate detector missed large, close-up plates. One annotated photograph was enough to find it.",
          },
        ]}
      />

      <Callout label="Models and data policy">
        <p>
          The classifier client is provider-neutral, but it isn’t policy-neutral: before a request is built, a check
          rejects any model whose data policy isn’t no-training and zero-retention. “Some” is treated as “no.”
        </p>
      </Callout>

      <H2>Deletable, but not editable</H2>
      <p>
        An issue’s history is hash-chained with SHA-256, so it can’t be quietly rewritten. But India’s data protection
        law gives people a right to erasure. So the chain is designed to allow deletion of an issue while making any
        edit detectable. The attack a hash chain defeats is the invisible one — and an erasure is visible by design.
      </p>
    </>
  );
}
