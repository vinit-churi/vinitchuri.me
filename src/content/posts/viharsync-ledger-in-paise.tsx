import { Callout, Code, H2, Lede, Steps } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "viharsync-ledger-in-paise",
  title: "Making a housing society’s books balance — in paise",
  dek: "Why ViharSync keeps a real double-entry ledger, stores every rupee as an integer, and lets Postgres refuse any journal entry that doesn’t add up.",
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
        Most housing societies in India run their money on an Excel sheet and a WhatsApp group. A treasurer types in
        who paid, someone else types in who didn’t, and once a year an auditor tries to make the two agree. We
        wanted ViharSync to make that reconciliation impossible to get wrong in the first place.
      </Lede>

      <p>
        The rule we set for the first release of ViharSync V2 was blunt: a society should be able to run day-to-day on
        ViharSync alone, without WhatsApp groups or Excel. For the money side, that meant not “a payments screen” but
        books — the kind a Chartered Accountant would sign off on. This post is about how those books work under the
        hood.
      </p>

      <H2>Money is an integer. Always.</H2>
      <p>
        The first decision was the smallest and the most important: <strong>every amount is an <code>int64</code>{" "}
        count of paise</strong>. Not a float, not a decimal string, not “rupees with two places.” ₹3,450 is{" "}
        <code>345000</code>.
      </p>
      <p>
        It’s easy to say and surprisingly easy to break, so we don’t rely on people remembering. Floats are banned in
        domain code by a lint rule, and ratios — interest, per-square-foot charges, percentage levies — go through a
        single helper that multiplies by a numerator and denominator and rounds half-up:
      </p>
      <Code lang="go — backend/internal/platform/money">{`
// Amounts are int64 paise. A ratio — interest, a per-sq-ft rate,
// a percentage levy — goes through one helper, rounded half-up.
func MulRatio(amount, num, den int64) int64
`}</Code>
      <p>
        The same rule runs all the way to the screen. The Flutter apps and the Next.js committee console both carry
        integer paise and only format to rupees at the very edge — with Indian digit grouping, because ₹1,00,000 is how
        a treasurer reads a lakh.
      </p>

      <H2>Every rupee moves twice</H2>
      <p>
        Double-entry bookkeeping is five hundred years old and still the best error-detection scheme in finance: every
        movement is recorded as a debit somewhere and an equal credit somewhere else. In ViharSync, every financial event
        posts a journal entry with its lines:
      </p>
      <div className="overflow-x-auto">
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>Debit</th>
              <th>Credit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Maintenance bill issued</td>
              <td>Members Receivable (that flat)</td>
              <td>Each charge head’s income account, Interest on Arrears</td>
            </tr>
            <tr>
              <td>Cash payment</td>
              <td>Cash in Hand</td>
              <td>Members Receivable</td>
            </tr>
            <tr>
              <td>Cheque / UPI / online payment</td>
              <td>Bank</td>
              <td>Members Receivable</td>
            </tr>
            <tr>
              <td>Expense</td>
              <td>The expense account</td>
              <td>Cash or Bank</td>
            </tr>
            <tr>
              <td>Bill cancelled</td>
              <td colSpan={2}>A mirror-image reversal of the original entry</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        A default chart of accounts is created the moment a society is onboarded — Cash, Bank, Members Receivable,
        Interest, a set of expense heads — so the very first bill already has somewhere correct to land.
      </p>

      <H2>Let the database say no</H2>
      <p>
        Application code has bugs. So the balancing rule doesn’t live only in Go — it lives in Postgres, as a deferred
        constraint trigger on <code>journal_lines</code>. At commit time, if the debits and credits of any entry
        don’t match, the whole transaction is rejected:
      </p>
      <Code lang="sql — db/migrations/00005_finance.sql">{`
CREATE CONSTRAINT TRIGGER journal_lines_balanced
    AFTER INSERT OR UPDATE OR DELETE ON journal_lines
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION assert_journal_entry_balanced();
-- RAISE EXCEPTION 'journal entry % is unbalanced: debit % credit % lines %'
`}</Code>
      <p>
        <code>DEFERRABLE INITIALLY DEFERRED</code> is the key part. Inside a transaction we can insert lines one by one
        — temporarily unbalanced — and the check only fires when we try to commit. An unbalanced ledger isn’t a state
        the system can be in.
      </p>

      <H2>Nothing is ever deleted</H2>
      <p>
        Real treasurers make mistakes: the wrong flat, a duplicate cheque, a bill issued before a rate change. The
        tempting fix is an edit button. We don’t have one. <strong>Bills can’t be edited</strong> — they’re cancelled
        with a reason and re-issued, and cancellation posts a reversing entry. Corrections are reversals or adjusting
        entries, never deletes. The audit trail is the ledger itself.
      </p>

      <H2>Where a payment goes</H2>
      <p>
        When a resident pays, the payment is allocated first-in, first-out: the opening balance carried over from the
        society’s old books first, then bills in order of due date. Anything left over becomes an advance, and the next
        bill absorbs it automatically. Within each bill, interest is settled before principal — which matters because
        of the next rule.
      </p>

      <H2>Interest that never earns interest</H2>
      <p>
        Maharashtra co-operative housing societies may charge interest on arrears, but only simple interest, only on the
        overdue principal, and capped at 12% a year — and it has to be backed by a resolution of the General Body. We
        encoded all of that, and again pushed the important part down into the schema:
      </p>
      <Code lang="sql">{`
CHECK (interest_rate_bps BETWEEN 0 AND 1200)
CHECK (interest_rate_bps = 0 OR length(trim(interest_resolution_ref)) > 0)
`}</Code>
      <p>
        You literally cannot configure interest without citing the resolution that authorised it. That reference is
        then printed on every bill line — “12% p.a. simple on overdue principal (GBM resolution 4/2026)” — so a member
        who questions a charge can see exactly where it came from.
      </p>

      <H2>A billing run is one transaction</H2>
      <Steps
        items={[
          {
            title: "Preview",
            body: "The treasurer previews the run. It executes the exact same code as the real thing — inside a transaction that is rolled back at the end.",
          },
          {
            title: "Issue",
            body: "For every flat: charge-head lines, one-off charges such as amenity fees, and interest. Each bill gets a number like SHR/2026-27/0046 and posts its journal entry.",
          },
          {
            title: "Serialise",
            body: "The whole run takes a per-society advisory lock, so two runs can never lock unit charges and bill numbers in opposite orders and deadlock.",
          },
        ]}
      />
      <p>
        There is no job queue. A society has hundreds of flats, not millions; a synchronous run in one transaction is
        both simpler and safer than a distributed one.
      </p>

      <H2>Statements that come straight from the journal</H2>
      <p>
        Because every number is in the journal, every report is just a different way of reading it: trial balance, day
        book, unit statements, Income &amp; Expenditure, Balance Sheet and Receipts &amp; Payments — each with a
        previous-year column, read from a single repeatable-read snapshot so the totals agree with each other, and
        exported as A4 PDFs with the Chairman · Secretary · Treasurer signature block that societies actually file.
      </p>

      <Callout label="How we test it">
        <p>
          Our demo society, Shreeniwas CHS, is built through the public API by a seed command — two wings, sixteen
          flats, three months of bills with interest, payments, expenses. That seed doubles as an end-to-end test, and
          its last assertion is the one we care about most: if the trial balance doesn’t net to zero, it fails with{" "}
          <em>“books do not balance”</em>.
        </p>
      </Callout>

      <H2>What’s not done yet</H2>
      <p>
        Honesty section. There’s no GST or TDS handling, no bank reconciliation and no period locking yet. A bounced
        cheque needs a manual adjusting entry. Interest is fixed when a bill is issued, so a payment recorded later with
        an earlier date doesn’t retroactively change it. All of these are on the roadmap — and all of them will be
        easier because the foundation is a ledger that can’t lie.
      </p>
    </>
  );
}
