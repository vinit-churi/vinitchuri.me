import { Callout, H2, Lede, Quote, Steps } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "tracesarkar-no-model-in-the-path",
  title: "No model in the path: why we hand-write the post and the PDF",
  dek: "TraceSarkar uses AI to read a photograph. It refuses to use AI to write a sentence about anyone. Here’s where we drew that line, and why.",
  category: "Principles",
  product: "tracesarkar",
  authors: ["vinit-churi"],
  date: "2026-10-14",
  readingMinutes: 8,
};

export default function Post() {
  return (
    <>
      <Lede>
        For a civic app with no marketing budget, the share is the growth channel. Every WhatsApp forward of a pothole
        record is an ad, a piece of evidence and a nudge to a ward office at once. So the text of that share matters
        more than almost anything else we write. We decided no language model would write it.
      </Lede>

      <H2>The temptation</H2>
      <p>
        We already use a vision-language model to classify photographs — pothole, open manhole, burst pipe — with a
        confidence floor below which it has to ask. Having the same kind of model write a friendly, punchy post about
        the result would take an afternoon. It would read better than anything we’d template.
      </p>
      <Quote cite="ADR 0020 — share text is generated, not written by a model">
        It would write better sentences than a template. It would also, eventually, write a fact.
      </Quote>
      <p>
        That’s the whole argument. A model asked to describe a pothole on a contracted road will, one day out of
        thousands, add a contractor that isn’t in the record, or an amount, or a word like “negligent.” Filters catch
        vocabulary. They don’t catch claims.
      </p>

      <H2>What we do instead</H2>
      <p>
        The share kit assembles the post from a fixed set of facts — the public view of an issue — using reviewed
        templates in English, Marathi and Hindi:
      </p>
      <Steps
        items={[
          {
            title: "Start from the public view",
            body: "Only fields in the public issue view can appear. What isn’t in it — the reporter, exact coordinates — is excluded by construction, not by remembering to leave it out.",
          },
          {
            title: "Fill reviewed templates",
            body: "Strings live as reviewable JSON with a review state. Marathi and Hindi ship marked as drafts until a native speaker has read them.",
          },
          {
            title: "Check the finished string",
            body: "A word-boundary check runs over the final post for three groups of terms: accusations of wrongdoing, insults, and political party names. If it fails, Compose refuses to return the text at all.",
          },
        ]}
      />
      <p>
        The tone is set by one rule from our brand notes: say <em>“48 hours have passed,”</em> never{" "}
        <em>“BMC has failed you again.”</em> State facts and joins; never conclusions.
      </p>
      <Quote cite="ADR 0020">The failure mode is a stilted sentence, not a false one.</Quote>

      <H2>The share kit caught our own bug</H2>
      <p>
        Building the deterministic post forced us to say exactly which deadline applies to what. And it turned out we’d
        been sloppy: the High Court’s 48-hour rule binds potholes — not every road defect. A model would have happily
        kept writing “48 hours” under every cracked footpath. A template that pulls the deadline from a cited table
        couldn’t, and the mismatch surfaced the moment we wrote the test.
      </p>
      <p>
        That’s also why no legal constant is a literal in our code. The 48-hour corporation deadline, the 24-hour
        contractor deadline during the warranty period, the ₹5,000-a-day penalty — each lives in a versioned table with
        an effective date and a citation.
      </p>

      <H2>The evidence PDF, written by hand</H2>
      <p>
        The same thinking produced the strangest piece of code in the repo: a hand-written PDF writer of around 400
        lines. Off-the-shelf libraries were fine at drawing pages. The problem was what they add quietly — a creation
        timestamp and a random document ID in every file.
      </p>
      <p>
        An evidence record should be reproducible: the same facts should produce the same document, and anyone should be
        able to check that. So our PDF is deterministic, and it’s stamped with a hash over the <em>facts</em>, not the
        rendered bytes. Citations that would run off the page count as no citation at all. URLs never hyphenate. Only the
        person who reported a sighting can download it.
      </p>

      <Callout label="Where AI does sit in TraceSarkar">
        <p>
          Reading the photograph. The classifier gets a structured-output prompt, a closed list of categories and a
          confidence floor of 0.65. Before a request is even built, a policy check rejects any model whose data policy
          isn’t no-training and zero-retention — because a model that trains on its inputs cannot be asked to forget a
          citizen’s photo.
        </p>
      </Callout>

      <H2>The line, stated plainly</H2>
      <p>
        Use models where their mistakes are cheap and caught — sorting a photo into a category, with a human-facing
        “are you sure?” when they’re unsure. Never use them where a mistake becomes a published statement about a named
        person. That line costs us some nicer sentences. It’s the cheapest insurance we’ll ever buy.
      </p>
    </>
  );
}
