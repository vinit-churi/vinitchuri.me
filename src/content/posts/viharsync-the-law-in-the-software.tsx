import { Callout, H2, Lede, Quote } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "viharsync-the-law-in-the-software",
  title: "Putting Maharashtra’s co-operative housing law into the software",
  dek: "Billing bases, a 12% interest cap, complaint clocks and refuge floors that must never become flats. What we learned turning bye-laws into types and constraints.",
  category: "Product",
  product: "viharsync",
  authors: ["vinit-churi", "kenil-joshi", "abhilash-pal", "abhishek"],
  date: "2026-10-14",
  readingMinutes: 8,
};

export default function Post() {
  return (
    <>
      <Lede>
        A housing society looks like a small community. Legally, in Maharashtra, it’s a co-operative society with a
        statute, model bye-laws, a registrar and a long tail of court rulings. Most society software ignores all of that
        and gives you a spreadsheet with nicer fonts. We read the rules first.
      </Lede>

      <p>
        Before building V2 we wrote four research briefs — on units and billing, building spaces, unit merges and real
        amenity rulebooks from societies in Pune, Mumbai, Hyderabad and Kolkata. Every claim that rested on a secondary
        source is marked <em>[uncertain]</em> in the brief, and where the product depends on one, the docs say so. Here’s
        what made it into the code.
      </p>

      <H2>Not every charge is billed the same way</H2>
      <p>
        A maintenance bill isn’t one number. It’s a set of charge heads, and the law says how each may be computed.
        ViharSync supports exactly three billing bases:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Basis</th>
              <th>What it means</th>
              <th>Example</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>per_unit</code>
              </td>
              <td>The same amount for every flat</td>
              <td>Service charges, ₹3,000 per flat</td>
            </tr>
            <tr>
              <td>
                <code>per_sqft</code>
              </td>
              <td>Rate × carpet area</td>
              <td>Property tax on common areas, ₹1 per sq ft</td>
            </tr>
            <tr>
              <td>
                <code>non_occupancy</code>
              </td>
              <td>Up to 10% of a flat’s service charges, only when it’s let out</td>
              <td>A tenant lives there and no owner or family does</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        The interesting one is the rule that <strong>a co-operative housing society may not bill service charges per
        square foot</strong>. Condominiums can; a CHS can’t. So the society’s legal form is part of its data, and when a
        CHS tries to create a per-square-foot service-charge head, the API refuses with a specific error rather than
        quietly allowing it. (This rule is flagged in our docs as pending verification against primary sources — we’d
        rather say so than pretend.)
      </p>

      <H2>Interest, capped and cited</H2>
      <p>
        Societies may charge interest on arrears — but only simple interest, only on overdue principal, at most 12% a
        year, and only if the General Body passed a resolution for it. In ViharSync, those aren’t guidelines in a help
        article; they’re database constraints. The rate can’t exceed 1,200 basis points, and a non-zero rate can’t be
        saved without the resolution reference. That reference is printed on every bill line that charges interest.
      </p>
      <p>
        Payments settle interest before principal, so interest never earns interest. It sounds pedantic until you’ve sat
        through an AGM argument about it.
      </p>

      <H2>Notices need proof; complaints need clocks</H2>
      <p>
        Two things the bye-laws care about live today in WhatsApp groups, where they can’t be proven. We built
        replacements for exactly those two.
      </p>
      <p>
        <strong>Notices with acknowledgement.</strong> When a notice needs it, each member’s acknowledgement is
        timestamped. That record is the proof of service, and the committee can see who has and hasn’t acknowledged.
      </p>
      <p>
        <strong>A complaint register with statutory clocks.</strong> Complaints are numbered like{" "}
        <code>C/2026-27/0001</code>. The committee must acknowledge within 3 days and decide within 15 — or 7 for urgent
        categories like leakage, lifts, electrical and security. Overdue flags are computed when you read the register,
        not by a scheduler that might not run. Resolving or rejecting needs reasons, and a resident can reopen within 7
        days of the decision.
      </p>

      <H2>A unit number is a legal identifier</H2>
      <p>
        Our first “generate units” dialog assumed flats are numbered floor × 100 + n. Committees couldn’t map their real
        buildings onto it. Real buildings have stilts, podiums, refuge floors, shops with their own number series and
        ground floors labelled G01 or 001. So V2 has a building builder, and three rules from the research shape it:
      </p>
      <ul>
        <li>
          <strong>Unit numbers are stored exactly as typed.</strong> “A-101” and “A101” may be different legal flats.
        </li>
        <li>
          <strong>Parking, gyms and refuge areas are not units</strong> — they’re never billed. Parking is an allotment,
          not property, a point the Supreme Court settled in 2010.
        </li>
        <li>
          <strong>Merged flats are closed, never deleted</strong>, because their history still matters to the books.
        </li>
      </ul>
      <Quote cite="Our reading of a 2026 Bombay High Court ruling on flats sold in refuge areas">
        A refuge must never accidentally become a billable unit.
      </Quote>

      <H2>The gate has rules too</H2>
      <p>
        Not everything is statutory. Some rules are just about respecting people. A guard sees a flat’s phone numbers
        only while a walk-in visitor is waiting for approval, so guards never end up with a phone directory. If nobody
        answers in 30 minutes, the visit expires. And if a guard decides to call a resident, the other residents of that
        flat are notified, so nobody is let in behind anyone’s back.
      </p>

      <Callout label="Coming next">
        <p>
          The statutory workflows societies dread most: transfers with the 90-day deemed-admission clock, the handover
          pack, records requests, and the AGM calendar. Same approach — research brief first, uncertain points marked,
          then rules in code.
        </p>
      </Callout>
    </>
  );
}
