import Link from "next/link";
import { Callout, H2, H3, Lede, Stats, Steps } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "fillmore-measuring-field-matching",
  title: "Measuring field matching: 69% to 96%, and zero wrong fills",
  dek: "Forms name the same field a hundred ways. Before making Fillmore smarter about it, I measured. The first finding was six fields it would have filled wrong without asking.",
  category: "Building",
  authors: ["vinit-churi"],
  date: "2026-10-19",
  readingMinutes: 6,
};

const STORE = "https://chromewebstore.google.com/detail/fillmore/jcdahajlfgjapnefcpbiahabmcappmna";

export default function Post() {
  return (
    <>
      <Lede>
        A date of birth field can be called “Date of Birth”, “D.O.B.”, <code>txtDtOfBrth</code>,{" "}
        <code>ctl00$ContentPlaceHolder1$txtDOB</code>, <code>dateofbirth</code>, “When were you born?” or “जन्म तिथि”.{" "}
        <Link href="/agents/fillmore">Fillmore</Link> has to know they’re all the same detail, and that “Nominee’s date of
        birth” is not.
      </Lede>

      <p>
        The obvious next step was a vector database: embed every label, match by meaning. Before building anything I
        wrote a test set, so I’d know whether any change actually helped. That turned out to be the most useful thing I did.
      </p>

      <H2>The test</H2>
      <p>
        I wrote 257 field descriptions in five groups: plain labels, fields where only the name or id says anything,
        different wording and typos, labels phrased as questions, and fields that belong to someone else or aren’t a
        personal detail at all. Each result lands in one of four buckets:
      </p>
      <Steps
        items={[
          { title: "Correct", body: "The right detail, or nothing for a field that isn’t yours." },
          { title: "Missed", body: "No match. The field stays yours to fill. Safe, just less helpful." },
          { title: "Wrong, but shown as “check”", body: "A wrong match you’d see with its reason before anything is filled." },
          { title: "Wrong and “ready”", body: "A wrong detail filled on one click without asking. This must be zero." },
        ]}
      />
      <p>
        Before changing anything, I also wrote a second, held-out set of 95 cases and didn’t look at its results while
        working, so I’d have some measure of whether changes generalise rather than just fit the first set.
      </p>

      <H2>The first finding: six silent wrong fills</H2>
      <p>The baseline was worse than I expected:</p>
      <Stats
        items={[
          { value: "69%", label: "of 257 fields matched correctly (178)" },
          { value: "45 of 88", label: "id-only fields missed" },
          { value: "6", label: "fields that would be filled wrong without asking" },
        ]}
      />
      <p>
        “Mother’s mobile number” would have received your mother’s name. “Child’s name” and “Sur name” would have received
        your own full name. “Previous address” would have got your current one. “Name of the company director” would have
        got your employer, and “Which country are you a citizen of?” your country of residence. Every one of those was
        already in the shipped matcher.
      </p>
      <p>
        I fixed them with rules that cover a whole family of cases, not one string at a time: family members (child, son,
        daughter, sibling) are someone else; a relative’s name field never takes a phone number, email or ID; “former”
        means the same as “previous”; a company’s PAN isn’t yours.
      </p>

      <H2>Reading names loosely</H2>
      <p>
        Most misses were field names that a person reads instantly and a phrase list doesn’t. So Fillmore now reads them
        the way a person would:
      </p>
      <Steps
        items={[
          { title: "Strip the framework", body: <>ASP.NET ids like <code>ctl00$ContentPlaceHolder1$txtDOB</code> become <code>DOB</code>; control prefixes like txt, ddl and cmb go.</> },
          { title: "Expand abbreviations", body: <>dt, brth, nm, fthr, ppt, mob, addr. Only unambiguous ones: “add” and “st” are real words or mean two things.</> },
          { title: "Split run-together words", body: <><code>dateofbirth</code> and <code>passportnumber</code>, against the profile’s own vocabulary.</> },
          { title: "Fix one-letter typos", body: "“Adress”, “Emial”, “Martial status”. Only when exactly one known word is that close, and for four-letter words only a missing or extra letter, so “call” never becomes “cell”." },
        ]}
      />
      <p>
        Anything matched this way is capped below the “ready” line. It shows as “check”, with the reason, and is never
        filled without you seeing it.
      </p>
      <p>
        Looking at the held-out failures at the end added two more general rules. A possessive whose owner isn’t you
        (“Manager’s name”) can’t be your detail, while “What’s your name?” is a contraction, not a possessive. And when
        the loose reading points at a different detail than the strict one (“Emai address” is an email, not an address),
        Fillmore asks.
      </p>

      <H2>Learning from you, across sites</H2>
      <p>
        Some labels no rule will ever read. So when you type into a field Fillmore couldn’t place, and what you typed is
        exactly one of your details, it learns that this label means that detail, on every site. The first time, the match
        is “check”. Once two forms agree, it’s trusted. A value that fits two details (“India” is both nationality and
        country) teaches nothing. Only labels are kept, never values, and Settings can forget them all.
      </p>
      <p>Simulating one hand-filled form for each field the rules still missed, it learned 8 of the 9.</p>

      <H2>Where it landed</H2>
      <Stats
        items={[
          { value: "96%", label: "of 257 fields (248), up from 69%" },
          { value: "99%", label: "of the 95 held-out fields (94), up from 76%" },
          { value: "0", label: "wrong fills without asking, in either set" },
        ]}
      />
      <Callout label="How far to trust that">
        <p>
          I wrote both test sets myself; they aren’t collected from real sites. And I looked at the held-out failures and
          fixed five of them, so its 99% is partly fitted. The fixes were general rules, but it’s no longer a clean test.
          The honest next measure is a few hundred labels collected from real forms.
        </p>
      </Callout>

      <H2>Then the embedding model, tested instead of assumed</H2>
      <p>
        With the rules at 96%, I ran the experiment I’d started with. A small embedding model only sees fields the rules
        leave unplaced, and the someone-else exclusions still apply. The acceptance threshold was tuned on the main set and
        frozen for the others. I also wrote 22 labels in Hindi and Marathi, because Indian forms often print them.
      </p>
      <Steps
        items={[
          { title: "Rules and learning", body: "248 of 257 · 94 of 95 · 3 of 22 Hindi/Marathi · 0 wrong." },
          { title: "+ English MiniLM-L6 (23 MB)", body: "252 · 94 · 3 · 0 wrong. Four question-style labels placed." },
          { title: "+ multilingual MiniLM-L12 (118 MB)", body: "254 · 94 · 19 · 4 wrong, three of them confident mistakes on one-word Hindi labels." },
        ]}
      />
      <p>
        Speed was never the problem. In headless Chromium on single-threaded WebAssembly, the English model loaded in 0.19
        seconds and took 4 ms per label; with the CPU slowed four times, 0.65 seconds and 17 ms. The costs are the
        download and about 10 MB of runtime in the extension.
      </p>
      <p>
        I also tried “pre-training” it with a library of example questions for each detail. That added one label over
        Fillmore’s own phrases. The model’s general knowledge does the work; there’s nothing to train.
      </p>

      <H3>So no model shipped</H3>
      <p>
        For English, rules plus learning are within about 1.5% of the best model on these sets. The one big gain was
        Hindi and Marathi, and that came from a bug, not a missing model: the label normaliser threw away every character
        outside a–z and 0–9. Keeping Devanagari and adding Hindi and Marathi phrases, with the same someone-else rules,
        took a 58-label Indian-language set from 13 to 56 correct, with no wrong fills. Most of those labels were written
        alongside the phrases, so that mostly proves the wiring; of 12 deliberately different spellings, 4 matched through
        genuine generalisation (three joined spellings, one spelling variant).
      </p>
      <p>
        The test that would change this decision is real-world labels. Until then, the extension stays small, fast and
        predictable, and the experiment sits in the repo, ready to re-run. These matching changes came after the first
        release on <a href={STORE}>the Chrome Web Store</a>, so they arrive there with an update.
      </p>
    </>
  );
}
