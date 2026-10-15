import { Callout, Code, H2, Lede, Quote, Stats, Steps } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "tracesarkar-bands-not-percentages",
  title: "Bands, not percentages: a spatial join you can’t afford to get wrong",
  dek: "How TraceSarkar matches a photo of a pothole to the ward that owns the road and the contract that paid for it — and why every gate is built to ask rather than guess.",
  category: "Building",
  product: "tracesarkar",
  authors: ["vinit-churi"],
  date: "2026-10-14",
  readingMinutes: 10,
};

export default function Post() {
  return (
    <>
      <Lede>
        The most valuable sentence TraceSarkar can show a citizen is also the most dangerous one: “this stretch of road
        is covered by this contract, held by this contractor.” Get it right and a pothole stops being a complaint and
        becomes a warranty claim. Get it wrong and you’ve published a false fact about a named party.
      </Lede>

      <p>
        So before we wrote a line of the join, we wrote down which mistake we were willing to make. Decision 004 in our
        log puts it plainly:
      </p>
      <Quote cite="TraceSarkar decision log, D004">
        A wrong published attribution is a defamation fact pattern. A missing one costs a feature.
      </Quote>
      <p>
        Precision over recall. Everything below follows from that one line.
      </p>

      <H2>The data was public. It just wasn’t joined.</H2>
      <p>
        Mumbai’s municipal corporation, the BMC, publishes a surprising amount. A data-availability audit in August
        turned up its open roads API: road-works geometry, with the work order behind each segment. Tender and award
        data lives on separate portals, keyed by tender ID rather than by place. Ward boundaries exist as BMC’s own 24
        polygons.
      </p>
      <p>
        None of it was joined to geography, to a warranty clock, or to the person standing on the broken road. That
        join is a database problem, not a policy problem — which is the kind we know how to solve.
      </p>
      <p>
        Twice a day, at 02:30 and 14:30 IST, a collector job archives BMC’s works data into a write-once bucket. The
        archive, not the parsed row, is the evidentiary record. The geometry is projected into a{" "}
        <code>road_segments</code> table stored as PostGIS <code>geography</code>, so every distance comes out in
        metres.
      </p>

      <H2>Which ward? Distance to the line, not the polygon</H2>
      <p>
        The obvious way to find a ward is a point-in-polygon test. PostGIS does it in one call. The problem is what it
        doesn’t tell you:
      </p>
      <Quote cite="D072">
        Distance to a polygon is zero anywhere inside it, which says nothing about whether the answer is safe.
      </Quote>
      <p>
        A phone reports its own GPS accuracy. If that accuracy is ten metres and the point is six metres inside a ward
        boundary, the point isn’t reliably in either ward. So after containment, we measure the distance to the ward
        <em> line</em> and compare it to the phone’s error. Inside the margin, we ask the user to confirm instead of
        answering.
      </p>
      <p>
        Two smaller lessons from the same week: BMC writes “R/C” in one dataset and “RC” in another, so ward codes are
        normalised before anything compares them. And road ownership in Mumbai changes with the season — it can never
        be inferred from how wide a road looks.
      </p>

      <H2>Which contract? The Decide() gate</H2>
      <p>
        Attribution lives in one function, <code>attribute.Decide</code>. It’s short, and it’s the most important code in
        the product:
      </p>
      <Steps
        items={[
          {
            title: "Search a radius that respects the phone",
            body: "Look for road segments within 15 m plus the reported GPS accuracy. A fix worse than 50 m can never produce a high-confidence answer, no matter what it finds.",
          },
          {
            title: "Look for a rival",
            body: "If a different segment is closer than the position’s own error, the answer is ambiguous. The result is check_this — the user is asked to confirm the spot.",
          },
          {
            title: "Break ties deterministically",
            body: "269 pairs of segments from different contract packages lie within a metre of each other. Ties break on work_id, so the same input always produces the same answer.",
          },
          {
            title: "Only show what governs",
            body: "A road contract is shown next to a road defect. It is never shown next to a garbage report — a lesson the first real photograph taught us.",
          },
        ]}
      />
      <p>And then it reports a band, not a number:</p>
      <Code lang="go — internal/attribute/decide.go (shape)">{`
type Confidence string

const (
    High      Confidence = "high"       // one segment, well inside the error
    CheckThis Confidence = "check_this" // a rival is closer than the GPS error
    None      Confidence = "none"       // nothing we'd stand behind
)
`}</Code>
      <Quote cite="On why there is no percentage">
        A percentage invites false precision about a judgement this coarse.
      </Quote>

      <H2>What we measured — and what it doesn’t prove</H2>
      <p>
        Every system in TraceSarkar v1 had to meet a bar before the next one could start. These two were the first to
        clear theirs:
      </p>
      <Stats
        items={[
          { value: "98.17%", label: "2,361 of 2,405 BMC works where BMC’s stated ward matched its own boundary polygon (bar: ≥95%)" },
          { value: "50/50", label: "attributions judged right by a human reviewer — zero naming the wrong contractor" },
          { value: "≥92.9%", label: "the honest floor on that 50/50, at a 95% Wilson interval" },
        ]}
      />
      <p>
        We publish the floor alongside the headline because 50 out of 50 is a small sample, and because the method has
        a limit we wrote down at the time: the reviewer judged from the same map the join used. That establishes that the
        join picks a plausible road — not that it picks the correct one on a real street. Validating against real defect
        locations is still open work.
      </p>
      <p>
        Coverage is the other honest number. In the pilot ward, Borivali, 43% of carriageway lies within 5 m of BMC’s
        works geometry, rising to 57% within 25 m. Trunk roads sit at 14% — the Western Express Highway is a state road,
        not BMC’s. A raw length ratio would have read 19.4%, and we refuse to quote it because it measures the wrong
        thing.
      </p>

      <H2>Probes test the join; photographs test the product</H2>
      <p>
        Synthetic tests got us a long way. Displacing points from all 198 Borivali segments at a 6 m fix produced 197
        high-confidence answers and zero wrong contractors. Then we walked outside and took two real photographs. They
        found three bugs in an afternoon — including a road contractor named next to a garbage pile, because the gate
        hadn’t asked whether a road contract governs garbage at all.
      </p>
      <Callout label="The rule we took from it">
        <p>
          Every gate in TraceSarkar now has to answer two questions: is this answer right, and is it the right{" "}
          <em>kind</em> of answer for this problem? A correct contractor shown on the wrong report is still a wrong
          fact.
        </p>
      </Callout>

      <H2>Why this matters beyond one city</H2>
      <p>
        The Bombay High Court has said that a reported pothole must be attended to within 48 hours, and that the
        contractor responsible during the warranty period can be held to it. That only works if someone can say,
        reliably and with sources, which contract covers which square metre of road. We’d rather show nothing than show
        that wrong — and the code is built so it can’t.
      </p>
    </>
  );
}
