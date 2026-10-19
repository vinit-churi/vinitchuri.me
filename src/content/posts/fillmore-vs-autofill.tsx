import Link from "next/link";
import { Callout, H2, Lede, Steps } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "fillmore-vs-autofill",
  title: "Why Fillmore, when browsers already autofill",
  dek: "Chrome now fills passport numbers for free, and AI browsers can fill a whole form for you. Where a careful, document-grounded filler still earns its place, and where it doesn’t.",
  category: "Product",
  authors: ["vinit-churi"],
  date: "2026-10-19",
  readingMinutes: 5,
};

const STORE = "https://chromewebstore.google.com/detail/fillmore/jcdahajlfgjapnefcpbiahabmcappmna";

export default function Post() {
  return (
    <>
      <Lede>
        Before building <Link href="/agents/fillmore">Fillmore</Link>, I looked at what already fills forms in October
        2026. Most of what I found came from store listings and vendor-written comparisons, so take the feature claims
        below as what the products say about themselves. The short version: the easy part of form filling is becoming
        free. The careful part is still open.
      </Lede>

      <H2>What’s out there</H2>
      <Steps
        items={[
          {
            title: "The browser itself",
            body: "Since October 2025, Chrome’s Enhanced Autofill can store and fill passport numbers, driver’s licences and vehicle details on top of names, addresses and cards, and it asks before filling. Google says it supports only a limited number of forms and sites so far.",
          },
          {
            title: "Browser agents",
            body: "Gemini’s Auto Browse in Chrome and ChatGPT Atlas’s agent mode navigate, fill forms and can finish tasks, including purchases. They’re powerful. They also send the page to a cloud model, and there’s a growing body of reports and papers on prompt injection in agentic browsers, including hidden form fields that steer the agent.",
          },
          {
            title: "AI form-filler extensions",
            body: "Many are thin wrappers: send the field list and your profile values to a model, paste the answer back. Few I found show where an answer came from, and none made asking instead of guessing the core loop.",
          },
          {
            title: "Vertical fillers",
            body: "Tools that know one kind of form deeply: job portals like Workday and Greenhouse, or Indian visa portals. Some stop before submitting; others are “auto-apply” bots that submit for you.",
          },
        ]}
      />

      <H2>Where Fillmore is different</H2>
      <p>
        If Chrome already fills your passport number, Fillmore can’t win by being “autofill, but for passport numbers”.
        It’s built for the long, odd, high-stakes forms, and for trust features I didn’t find elsewhere:
      </p>
      <Steps
        items={[
          { title: "It learns from your documents", body: "A passport’s machine-readable zone, with its check digits verified, a payslip PDF, a utility bill. Not a profile you retype." },
          { title: "Every value shows its source", body: "Point at a filled field and it tells you which document the value came from. In the panel, you see the exact snippet." },
          { title: "It asks instead of guessing", body: "Two addresses on file, a date with no format given, an option it can’t match: each becomes a question, not a pick." },
          { title: "It never presses Submit", body: "There is no code path that submits a form, presses Enter or ticks a declaration, and the end-to-end tests check that nothing was submitted after a fill." },
          { title: "Filling never sends your values to a model", body: "Field matching and filling run on your device. If you add a Claude key, the model sees field labels and the names of your details, never their values. (Reading a photo or scan of a document does send that document to Claude, and only if you added a key.)" },
        ]}
      />
      <p>
        That last point matters most against browser agents. An agent that holds your passport details, reads the page
        and is trying to finish the task is exactly what a malicious page wants to talk to. Fillmore has nothing to leak
        through a model and no action to be tricked into beyond the plan you review.
      </p>
      <p>
        It’s also measured, not just promised. On the test sets I wrote for field matching, it recognises 96% of 257 field
        descriptions and 99% of a separate 95, with no field filled wrong without asking.{" "}
        <Link href="/writing/fillmore-measuring-field-matching">How that was measured, and its limits</Link>.
      </p>

      <H2>Where it’s worse</H2>
      <p>These are real tradeoffs, not footnotes:</p>
      <Steps
        items={[
          { title: "It knows nothing until you give it something", body: "Load a document, or fill one form by hand and let it remember. Chrome’s autofill uses details you’ve already saved in Chrome." },
          { title: "It’s slower than an agent, on purpose", body: "It stops to ask and leaves Submit to you. If you want a task done end to end, a browser agent will do more for you." },
          { title: "It’s Chrome only", body: "Firefox is on the roadmap, not in the store." },
          { title: "Photos and scans need your own key", body: "Text and PDFs with a text layer are read on your device. Photos and scanned PDFs go to Claude, and only if you add a key; there’s no local OCR yet." },
          { title: "It doesn’t know any one portal deeply", body: "A vertical tool built for one job site or one visa portal knows its quirks better. Fillmore is generic, with Indian-form vocabulary built in." },
          { title: "No sync", body: "Your profile lives on one device, by design. There’s no account to sync it through." },
        ]}
      />

      <Callout label="The risk I watch">
        <p>
          Chrome could add document import and per-value sources itself. If it does, Fillmore’s answer has to be depth on
          hard forms (Indian visa, passport, tax and KYC vocabulary, split fields, odd date formats) and a trust story that’s
          hard to copy from inside a general agent built to finish tasks.
        </p>
      </Callout>

      <H2>Who it’s for</H2>
      <p>
        If your forms are short and common, Chrome’s autofill is enough, and free. If you want a task done for you, try a
        browser agent and watch what it sends. If you’re filling a visa application, a passport form or a long KYC, and
        you’d rather be asked than be wrong, that’s the form Fillmore was built for.{" "}
        <a href={STORE}>It’s on the Chrome Web Store</a>.
      </p>
    </>
  );
}
