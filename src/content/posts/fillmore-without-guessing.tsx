import Link from "next/link";
import { Callout, H2, Lede, Quote, Steps } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "fillmore-without-guessing",
  title: "How Fillmore fills a form without guessing",
  dek: "A form filler that stops to ask, shows where every answer came from and never presses Submit. The architecture behind those promises, and the choices that keep them.",
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
        <Link href="/agents/fillmore">Fillmore</Link> is now on the{" "}
        <a href={STORE}>Chrome Web Store</a>. It fills long web forms from your own documents. Before it shipped, its
        page made four promises: it won’t guess, it won’t press Submit, it won’t hide its sources, and it won’t keep what
        you delete. This post is about how the code keeps them.
      </Lede>

      <p>
        The forms I had in mind are the long, high-stakes ones: a visa application, a passport form, a tax return, bank
        KYC, a 47-field job portal. A wrong answer there costs money or weeks. So the question was never “how do we fill
        faster?” It was “how do we fill without ever being confidently wrong?”
      </p>

      <H2>A plan before a single keystroke</H2>
      <p>
        Opening Fillmore on a form doesn’t fill anything. It produces a plan: every field, the value it would use, the
        document that value came from, and one of a few statuses.
      </p>
      <Steps
        items={[
          { title: "Ready", body: "One value, a confident match, a format the field accepts. Filled on one click." },
          { title: "Check", body: "Filled only if you leave it ticked, with the reason shown: a value worked out from others, a weaker match." },
          { title: "Question", body: "Your documents disagree, or the form wants a format Fillmore can’t infer. It asks, with tap-to-answer choices." },
          { title: "Skipped", body: "Hidden fields, passwords, one-time codes, card numbers, CAPTCHAs, declarations. Never filled, even if asked." },
        ]}
      />
      <p>
        That plan is the product. It makes “won’t guess” and “won’t hide its sources” something you can see, not a
        policy you have to trust. And because it’s already sorted, reviewing it takes seconds.
      </p>

      <H2>Disagreement becomes a question</H2>
      <p>
        The test persona in the repo, Asha Rao, has a passport with a Mumbai address and an electricity bill at a newer
        one in Pune. A filler that picks one is guessing. Fillmore asks once: “You have more than one address on file.
        Which one should this form use?” and the answer covers all six address lines, so a street from one document
        never ends up next to a PIN code from the other.
      </p>
      <p>
        Dates get the same treatment. If a form writes DD/MM/YYYY next to the field, the date goes in that way. If the
        page gives no hint and 03/04/1991 could be either day first or month first, that’s a question too. Values Fillmore
        works out rather than reads (an annual income as twelve times the monthly gross on a payslip, a first name split from a full name)
        are allowed, but only ever as “check”.
      </p>

      <H2>Rules first, a model only where rules can’t reach</H2>
      <p>
        Field understanding runs on the device with no model: the field’s autocomplete hint, label, name and id,
        placeholder, nearby text and section heading, scored against a profile of the details these forms ask for, with Indian-form
        vocabulary built in (father’s name, PAN, PIN code, place of issue). Documents are read the same way. A passport’s
        machine-readable zone is parsed with its check digits verified, so those values are the most trusted in the
        profile. Text and PDFs with a text layer go through labelled-field rules.
      </p>
      <p>
        Claude comes in only for two jobs: photos and scans with no text layer, and fields the rules couldn’t place. Both
        need your own key. Even then, a passport MRZ beats the model: in one test the model read a passport number as
        “Z4821987”, and the verified MRZ quietly corrected it to “Z4821937”.
      </p>
      <Callout label="Why this order">
        <p>
          Deterministic readers are instant, free, private and testable. They also mean the whole extension works with no
          API key at all, which is how most people will use it.
        </p>
      </Callout>

      <H2>Mapping fields never shows the model your values</H2>
      <p>
        When Claude helps map a field, it gets the field’s label, name, type and options, plus the <em>names</em> of the
        details you have, like <code>passport_number</code>. Never the values. It answers with “this field is that kind of
        detail”, and the filling happens locally. (The one time a model sees document content is when you ask it to
        read a photo or scan of a document, with your own key.)
      </p>
      <p>
        That one decision is most of Fillmore’s defence against prompt injection, the known attack on agents that fill
        forms: hidden text on a page telling the agent to put your data somewhere it shouldn’t. There’s nothing to leak
        through the model, a mapping can only point at a detail you own, and a model’s mapping is capped below “ready”, so
        you see it before it’s filled. One of the demo forms is deliberately hostile, with a hidden honeypot field that
        asks to be filled with your details. The end-to-end test checks it stays empty.
      </p>

      <H2>Submit is not in the code</H2>
      <p>
        The promise that Fillmore won’t press Submit isn’t a setting. The content script has no code path that submits a
        form, presses Enter, clicks a button or ticks a checkbox. Declarations and consents belong to you, so checkboxes
        are always skipped. The end-to-end tests that fill a form finish by checking it was never submitted.
      </p>
      <Quote cite="Fillmore’s decision log, D4">
        Fillmore removes the reward: there is nothing to exfiltrate through the model, and no action it can be tricked into
        beyond the plan the user reviews.
      </Quote>

      <H2>Every value has a source</H2>
      <p>
        Each detail in your profile remembers the document it came from, the exact snippet, and how it was read: MRZ, a text
        rule, Claude, typed by you. On the page, each filled field gets a soft outline and a small § tab; point at it to see
        where the value came from. Delete a document and every detail that came only from it goes with it. Wipe clears
        everything.
      </p>
      <p>
        Your profile lives in Chrome’s local extension storage on your device. There is no Fillmore server. An optional
        passphrase encrypts it (AES-GCM, with the key derived from your passphrase), and the unlocked key is kept only in
        memory until the browser closes.
      </p>

      <H2>The penguin, and its manners</H2>
      <p>
        A side panel you have to remember to open is a weak product, so Fillmore has a penguin that appears next to forms.
        That’s also how assistants become Clippy. Most of the penguin’s code is about manners:
      </p>
      <Steps
        items={[
          { title: "Only where you let it", body: "It appears on its own only on sites you allowed, or everywhere if you opt in. At install, Fillmore can see only the tab you click it on." },
          { title: "Only when it can help", body: "Calendars, editors and search pages get nothing, not even a “?” badge. It speaks up when it can fill something, or after you’ve sent a form." },
          { title: "Easy to send away", body: "Not now, not on this site, pause for an hour, pause everywhere. Its UI lives in a closed shadow root, so the page can’t read what it shows you." },
          { title: "No homework", body: "Fill a form by hand and it remembers what it recognised, says so, and offers Undo. Head for Submit and it lists what’s still empty, without ever blocking you." },
        ]}
      />

      <H2>What I left out, on purpose</H2>
      <p>
        No auto-submit or auto-apply. No account and no cloud sync. No “read all sites” permission at install. No model in
        the default path. Documents aren’t kept unless you ask: a file you attach to a form, or tick “Keep a copy” for, is
        stored on your device so it can be attached again; otherwise only the details are kept. Each of these would make a
        demo look better and a high-stakes form riskier.
      </p>
      <p>
        That’s the trade Fillmore makes everywhere: it would rather stop and ask than be fast and wrong. If that’s the
        trade you want for your visa form, <a href={STORE}>it’s on the Chrome Web Store</a>.
      </p>
    </>
  );
}
