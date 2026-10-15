import Image from "next/image";
import { JsonLd } from "@/components/json-ld";
import {
  FILLMORE_IMAGE,
  FillmoreFilm,
  FillmoreHero,
  PlayFilmButton,
  WaitlistForm,
} from "@/components/fillmore/fillmore-client";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import styles from "./fillmore.module.css";

export const metadata = pageMetadata({
  title: "Fillmore — the form-filling agent",
  description:
    "Fillmore is a browser extension Vinit Churi is designing. Upload your documents once; it fills any web form, asks when it isn’t sure, and leaves Submit to you. Join the waitlist.",
  path: "/agents/fillmore",
  keywords: ["Fillmore", "form-filling agent", "AI form filler", "browser extension", "autofill documents", "OCR"],
});

const steps = [
  {
    title: "Set it up your way",
    body: "Choose what Fillmore may use. Start with a saved profile and add more sources whenever you like.",
    chips: [["Saved profile"], ["Documents"], ["Cloud folders · later", "later"]],
  },
  {
    title: "Drop in documents",
    body: "Passports, ID cards, payslips, bills. Fillmore reads them with OCR and adds what it finds to your profile, where you can check and edit it.",
    chips: [["PDF"], ["Photos"], ["Scans"]],
  },
  {
    title: "Open any form",
    body: "Fillmore finds the fields, fills what it knows in seconds, and tags each answer with the document it came from.",
    chips: [["Chrome"], ["Firefox · later", "later"]],
  },
  {
    title: "Review, then submit",
    body: "Anything uncertain is flagged as a question for you. Fillmore never presses Submit. You read it through and send it.",
    chips: [["You stay in charge"]],
  },
];

const promises = [
  { icon: "?", title: "It won’t guess", body: "Two addresses on file, or a field it can’t match? It stops and asks you." },
  { icon: "⏎", title: "It won’t press Submit", body: "The last click is always yours, on every form, every time." },
  { icon: "§", title: "It won’t hide its sources", body: "Every filled field shows where the answer came from, so checking takes seconds." },
  { icon: "⌫", title: "It won’t keep what you delete", body: "Remove a document or wipe your profile, and it is gone." },
];

export default function FillmorePage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Agents", path: "/#agents" },
          { name: "Fillmore", path: "/agents/fillmore" },
        ])}
      />
      <FillmoreHero />

      <section className="mx-auto max-w-[1120px] px-6 py-26">
        <div className={styles.problem}>
          <p className={styles.problemText}>
            You have typed your passport number into a web form more times than you can count.{" "}
            <span>Your address, your employer, the date you joined, your father’s name. Every form starts from zero.</span>
          </p>
          <div className={styles.fieldStack} aria-hidden>
            <div className={`${styles.fsRow} ${styles.again}`}>
              <span>Full name</span>
              <div>Asha Rao</div>
            </div>
            <div className={`${styles.fsRow} ${styles.again}`}>
              <span>Passport no.</span>
              <div>Z4821937</div>
            </div>
            <div className={`${styles.fsRow} ${styles.again}`}>
              <span>Address</span>
              <div>14 Lake Road, Pune 411001</div>
            </div>
            <div className={styles.fsRow}>
              <span>Employer</span>
              <div />
            </div>
            <div className={styles.fsRow}>
              <span>Date joined</span>
              <div />
            </div>
            <span className={styles.fsCount}>Field 5 of 47 · sample</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pb-26">
        <PlayFilmButton className={styles.poster}>
          <span className={styles.posterGlow} aria-hidden />
          <span className={styles.posterText}>
            <small>A short film · 45 s</small>
            <b>Fillmore and the 47-field form</b>
            <span>The whole idea, told by a nervous penguin. It plays right here on the page.</span>
          </span>
          <span className={styles.posterGo}>
            <svg width="12" height="14" viewBox="0 0 14 16" aria-hidden>
              <path d="M1 1.5v13l12-6.5z" fill="currentColor" />
            </svg>
            Play
          </span>
          <Image src={FILLMORE_IMAGE} alt="" width={720} height={658} unoptimized />
        </PlayFilmButton>
      </section>

      <section id="how" className="mx-auto max-w-[1120px] scroll-mt-24 px-6 pb-26">
        <div className={styles.secHead}>
          <h2 className={styles.h2}>
            How it <em>would</em> work
          </h2>
          <p>Four steps, in the order you would meet them. This is the design I am working from; none of it is built yet.</p>
        </div>
        <ol className={styles.steps}>
          {steps.map((s, i) => (
            <li key={s.title} className={styles.step}>
              <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <div className={styles.chips}>
                {s.chips.map(([label, kind]) => (
                  <span key={label} className={`${styles.chip} ${kind === "later" ? styles.later : ""}`}>
                    {label}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pb-26">
        <div className={styles.secHead}>
          <h2 className={styles.h2}>
            What Fillmore <em>won’t</em> do
          </h2>
          <p>The rules I am designing around. If a feature would break one of these, it doesn’t ship.</p>
        </div>
        <div className={styles.promises}>
          {promises.map((p) => (
            <div key={p.title} className={styles.promise}>
              <span className={styles.promiseIcon} aria-hidden>
                {p.icon}
              </span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pb-26">
        <div className={styles.secHead}>
          <h2 className={styles.h2}>
            Where it <em>stands</em>
          </h2>
          <p>
            Fillmore is an idea I am designing in the lab. The waitlist helps me decide what to build first, and who
            to show it to.
          </p>
        </div>
        <div className={styles.statusStrip}>
          <div>
            <small>Stage</small>
            <b>Idea and design</b>
            <span>No extension to install yet.</span>
          </div>
          <div>
            <small>First target</small>
            <b>Chrome extension</b>
            <span>Long personal forms: visas, tax, job applications.</span>
          </div>
          <div>
            <small>Next step</small>
            <b>Talking to people</b>
            <span>Especially anyone who fills a lot of forms.</span>
          </div>
        </div>
      </section>

      <section id="join" className={`${styles.join} scroll-mt-16`}>
        <div className={`mx-auto max-w-[1120px] px-6 py-26 ${styles.joinInner}`}>
          <div>
            <h2>Let Fillmore worry about forms.</h2>
            <p className={styles.joinLede}>
              Join the waitlist and I will write when there is something to try. One email when it is ready, nothing
              else.
            </p>
            <WaitlistForm id="waitlist-join" />
          </div>
          <Image
            className={styles.joinArt}
            src={FILLMORE_IMAGE}
            alt="Fillmore, a penguin in a red scarf and a vest, holding a clipboard"
            width={720}
            height={658}
            unoptimized
          />
        </div>
      </section>

      <FillmoreFilm />
    </>
  );
}
