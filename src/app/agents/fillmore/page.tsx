import Image from "next/image";
import { JsonLd } from "@/components/json-ld";
import Link from "next/link";
import {
  FILLMORE_IMAGE,
  FillmoreFilm,
  FillmoreHero,
  InstallButton,
  PlayFilmButton,
} from "@/components/fillmore/fillmore-client";
import { FILM_LENGTH, POSES } from "@/components/fillmore/engine";
import { FILLMORE_STORE_URL } from "@/content/agents";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, fillmoreSchema } from "@/lib/schema";
import styles from "./fillmore.module.css";

export const metadata = pageMetadata({
  title: "Fillmore — the form-filling agent",
  description:
    "Fillmore is a free Chrome extension by Vinit Churi. Add your documents once; it fills long web forms on your device, asks when it isn’t sure, and leaves Submit to you.",
  path: "/agents/fillmore",
  keywords: ["Fillmore", "form-filling agent", "AI form filler", "Chrome extension", "autofill documents", "visa form", "Hindi forms"],
});

const steps = [
  {
    title: "Set it up your way",
    body: "Add documents, type details in, or just fill forms as usual: Fillmore remembers what you type, says so, and lets you undo it. Everything stays on this device, sealed with a passphrase if you set one.",
    chips: [["Documents"], ["What you type"], ["Cloud folders · later", "later"]],
  },
  {
    title: "Drop in documents",
    body: "Passports, ID cards, payslips, bills. Text and PDFs are read on your device, passports by their machine-readable lines with check digits. Photos and scans need a key from an AI provider you already use, or a model running on your own computer. What it finds goes into a profile you can check and edit.",
    chips: [["PDF"], ["Text"], ["Photos · your AI key"]],
  },
  {
    title: "Open any form",
    body: "Fillmore finds the fields, even ones named txtDtOfBrth or labelled in Hindi or Marathi, fills what it is sure of, and marks each answer with where it came from. It works inside pop-up dialogs and multi-step applications, and can attach your resume or proof of address to upload fields too.",
    chips: [["Chrome"], ["हिन्दी · मराठी"], ["Firefox · later", "later"]],
  },
  {
    title: "Review, then submit",
    body: "Anything uncertain becomes a question you answer with a tap. Head for Submit and it lists what is still missing. It never presses Submit: you read it through and send it.",
    chips: [["You stay in charge"]],
  },
];

const lately = [
  { title: "A history of forms you send", body: "When, where, and every answer, marked as yours, Fillmore’s or the page’s. Search it, copy an answer, or fill the same form again in one click." },
  { title: "Screening answers, remembered", body: "Answer “years of experience” or a yes/no question once, and it fills the same question on the next application, even when it is worded a little differently." },
  { title: "Fill automatically, if you want", body: "Off by default. Turn it on for a site and it fills what it is sure of as soon as a form opens. Undo is one click." },
  { title: "Your own AI, any provider", body: "Bring a key you already pay for, or run a model on your own computer so nothing leaves it. The same safety rules apply to every model." },
  { title: "Pop-ups and multi-step forms", body: "It works inside application dialogs, and treats Next, Continue and Review as steps of one form, not as sending it." },
  { title: "Keys and secrets left alone", body: "API keys, tokens and recovery codes are treated like passwords: never filled, never remembered, never in your history." },
];

const films = [
  { src: "/agents/fillmore/video/meet.mp4", poster: "/agents/fillmore/video/meet.jpg", title: "Meet Fillmore", length: "25 s" },
  { src: "/agents/fillmore/video/history.mp4", poster: "/agents/fillmore/video/history.jpg", title: "A history of every form", length: "28 s" },
  { src: "/agents/fillmore/video/whats-new.mp4", poster: "/agents/fillmore/video/whats-new.jpg", title: "What’s new, v0.5 → v0.7", length: "38 s" },
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
      <JsonLd data={fillmoreSchema()} />
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
            <small>A short film · {FILM_LENGTH} s</small>
            <b>Fillmore and the 47-field form</b>
            <span>The whole idea, told by a nervous penguin. It plays right here on the page.</span>
          </span>
          <span className={styles.posterGo}>
            <svg width="12" height="14" viewBox="0 0 14 16" aria-hidden>
              <path d="M1 1.5v13l12-6.5z" fill="currentColor" />
            </svg>
            Play
          </span>
          {/* The nervous one: the film is told by him. */}
          <Image src={POSES.panic.src} alt="" width={693} height={600} unoptimized />
        </PlayFilmButton>
      </section>

      <section id="how" className="mx-auto max-w-[1120px] scroll-mt-24 px-6 pb-26">
        <div className={styles.secHead}>
          <h2 className={styles.h2}>
            How it <em>works</em>
          </h2>
          <p>Four steps, in the order you meet them.</p>
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
            What’s <em>new</em>
          </h2>
          <p>Added since it went live, from using it on real forms. All of it free, all of it on your device.</p>
        </div>
        <ul className={styles.lately}>
          {lately.map((f) => (
            <li key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pb-26">
        <div className={styles.secHead}>
          <h2 className={styles.h2}>
            See it <em>work</em>
          </h2>
          <p>Three short clips made from the real extension. No sound needed.</p>
        </div>
        <ul className={styles.films}>
          {films.map((f) => (
            <li key={f.src}>
              <video
                className={styles.filmClip}
                src={f.src}
                poster={f.poster}
                width={720}
                height={1280}
                controls
                muted
                playsInline
                preload="none"
                aria-label={f.title}
              >
                <a href={f.src}>Watch “{f.title}”</a>
              </video>
              <p>
                <b>{f.title}</b> <span>{f.length}</span>
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-[1120px] px-6 pb-26">
        <div className={styles.secHead}>
          <h2 className={styles.h2}>
            What Fillmore <em>won’t</em> do
          </h2>
          <p>The rules it is built around, each one covered by its tests. If a feature would break one, it doesn’t ship.</p>
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
          <p>Fillmore is out, free, and early. If it stumbles on a form you use, I want to hear about it.</p>
        </div>
        <div className={styles.statusStrip}>
          <div>
            <small>Stage</small>
            <b>Live on the Chrome Web Store · v0.8.1</b>
            <span>Free. No account to make.</span>
          </div>
          <div>
            <small>Runs</small>
            <b>On your device</b>
            <span>Nothing leaves it unless you add your own AI key.</span>
          </div>
          <div>
            <small>Next</small>
            <b>Real-world forms</b>
            <span>Send me a form it gets wrong, and it gets better at all of them.</span>
          </div>
        </div>
      </section>

      <section id="install" className={`${styles.join} scroll-mt-16`}>
        <div className={`mx-auto max-w-[1120px] px-6 py-26 ${styles.joinInner}`}>
          <div>
            <h2>Let Fillmore worry about forms.</h2>
            <p className={styles.joinLede}>
              Free on the Chrome Web Store. Add your documents, open a form, and press Fill. You read it through and
              press Submit yourself.
            </p>
            <InstallButton />
            <p className={styles.joinLinks}>
              <a href="/fillmore-demo/">Try it on demo forms</a>
              <Link href="/agents/fillmore/privacy">Privacy policy</Link>
              <a href={FILLMORE_STORE_URL} target="_blank" rel="noopener noreferrer">
                Fillmore on the Chrome Web Store
              </a>
            </p>
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
