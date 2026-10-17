import { JsonLd } from "@/components/json-ld";
import { site } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMetadata({
  title: "Fillmore privacy policy",
  description:
    "What the Fillmore browser extension keeps, where, and what it sends: everything stays on your device unless you add your own Claude API key.",
  path: "/agents/fillmore/privacy",
});

const UPDATED = "17 October 2026";

export default function FillmorePrivacyPage() {
  return (
    <div className="mx-auto max-w-[760px] px-6 pt-20 pb-24 sm:pt-28">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Fillmore", path: "/agents/fillmore" },
          { name: "Privacy", path: "/agents/fillmore/privacy" },
        ])}
      />
      <p className="font-mono text-xs text-muted">Fillmore · Privacy policy · Updated {UPDATED}</p>
      <h1 className="mt-4 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1] font-bold tracking-[-0.04em]">
        Your details stay <span className="font-serif font-normal italic">on your device.</span>
      </h1>
      <div className="prose mt-10">
        <p>
          Fillmore is a Chrome extension that fills web forms from documents you give it. This page says exactly what it
          keeps, where, and what leaves your device. There is no Fillmore server: I, {site.name}, never receive your
          documents, your details or what you do with the extension.
        </p>

        <h2>What Fillmore keeps, and where</h2>
        <ul>
          <li>
            <strong>Your profile</strong>: the details read from your documents or typed by you (name, date of birth,
            address, passport number and similar), each with the document it came from. Stored in Chrome&rsquo;s local
            extension storage on this device.
          </li>
          <li>
            <strong>What you type into forms</strong>, when you submit them: details Fillmore recognises are added to your
            profile so it can fill them next time. It tells you each time, with Undo, or asks first if you choose that.
            Passwords, payment cards, one-time codes, hidden fields and other people&rsquo;s details are never kept.
          </li>
          <li>
            <strong>Files</strong>, only when you choose: a file you attach to a form&rsquo;s upload field (such as a
            resume), or a document you add with &ldquo;Keep a copy&rdquo; ticked, is kept in the extension&rsquo;s own
            storage so it can be attached to the next form that asks for one. Otherwise documents are read and dropped;
            only the details found in them are kept.
          </li>
          <li>
            <strong>Settings</strong>, answers you asked it to remember for a site, and where you dragged the penguin.
          </li>
        </ul>
        <p>
          If you set a passphrase, your profile and kept files are encrypted (AES-256-GCM) with a key derived from it, and
          the unlocked key is held only in memory until the browser closes.
        </p>

        <h2>What leaves your device</h2>
        <p>
          Nothing, unless you add your own Anthropic (Claude) API key in Settings. With a key, and only for these tasks:
        </p>
        <ul>
          <li>
            <strong>Reading a photo or scanned PDF</strong> you add: the file is sent to Anthropic&rsquo;s API to read
            the text. Text files and PDFs with text are read on your device.
          </li>
          <li>
            <strong>Fields the built-in rules can&rsquo;t place</strong>: those fields&rsquo; labels, hint text, section
            headings and dropdown choices, with the names of the kinds of details you have (for example &ldquo;date of
            birth&rdquo;). Never the values.
          </li>
          <li>
            <strong>Explaining a confusing field</strong>: the page title and the labels, hints and dropdown choices of
            that field and other unclear fields on the form (explained together, once). Never your details.
          </li>
        </ul>
        <p>
          These requests go straight from your browser to Anthropic under your key and are covered by{" "}
          <a href="https://www.anthropic.com/legal/privacy">Anthropic&rsquo;s privacy policy</a>. Fillmore has no
          analytics, no tracking, no ads, and sells or shares nothing.
        </p>

        <h2>What Fillmore does on web pages</h2>
        <p>
          It reads a page&rsquo;s form fields only on a tab where you open it, or on sites you allowed the penguin on. It
          fills fields only when you press Fill, never presses Submit, and never fills passwords, payment cards, CAPTCHAs
          or hidden fields. Page content is not sent anywhere, except the field labels described above.
        </p>

        <h2>Deleting your data</h2>
        <p>
          Deleting a document in Fillmore deletes every detail and file that came from it. Settings &rarr; Wipe deletes
          everything at once. Removing the extension from Chrome deletes all of its storage.
        </p>

        <h2>Contact</h2>
        <p>
          Questions or requests: <a href={`mailto:${site.email}`}>{site.email}</a>. If this policy changes, the date at
          the top changes with it.
        </p>
      </div>
    </div>
  );
}
