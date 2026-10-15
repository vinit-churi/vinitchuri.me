"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "@/app/agents/fillmore/fillmore.module.css";
import { site } from "@/content/site";
import { FILM_LENGTH, FILM_SUBTITLES, createFilm, startSky } from "./engine";

export const FILLMORE_IMAGE = "/agents/fillmore.png";
const PLAY_EVENT = "fillmore:play";

function loadPenguin() {
  const img = new Image();
  img.src = FILLMORE_IMAGE;
  return img;
}

/** Any button can start the film; it plays from wherever it was clicked. */
export function PlayFilmButton({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      className={className}
      onClick={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        const x = e.clientX || b.left + b.width / 2;
        const y = e.clientY || b.top + b.height / 2;
        window.dispatchEvent(new CustomEvent(PLAY_EVENT, { detail: { x, y } }));
      }}
    >
      {children}
    </button>
  );
}

/**
 * The waitlist has no backend yet (the site is a static export), so joining opens an
 * email to me with the address filled in.
 */
export function WaitlistForm({ id, dark }: { id: string; dark?: boolean }) {
  const [note, setNote] = useState("");
  return (
    <>
      <form
        className={`${styles.waitlist} ${dark ? styles.dark : ""}`}
        onSubmit={(e) => {
          e.preventDefault();
          const email = new FormData(e.currentTarget).get("email")?.toString().trim() ?? "";
          const subject = encodeURIComponent("Fillmore waitlist");
          const body = encodeURIComponent(`Please add ${email} to the Fillmore waitlist.`);
          window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
          setNote(`Your email app should open now. If it doesn’t, write to ${site.email}.`);
        }}
      >
        <label htmlFor={id} className="sr-only">
          Email address
        </label>
        <input id={id} name="email" type="email" required placeholder="you@email.com" autoComplete="email" />
        <button type="submit">Join the waitlist</button>
      </form>
      <p className={styles.formNote} aria-live="polite">
        {note}
      </p>
    </>
  );
}

export function FillmoreHero() {
  const heroRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !skyRef.current || !artRef.current) return;
    return startSky(skyRef.current, heroRef.current, artRef.current, loadPenguin());
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="fillmore-title">
      <canvas ref={skyRef} className={styles.sky} aria-hidden />
      <div className={`mx-auto max-w-[1120px] px-6 ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.crumb}>
            <Link href="/#agents">Agents</Link> / Form-filling agent
          </p>
          <span className={styles.status}>
            <i aria-hidden />
            In the lab · nothing to install yet
          </span>
          <h1 id="fillmore-title" className={styles.title}>
            Fillmore<em>The form-filling agent that lives in your browser.</em>
          </h1>
          <p className={styles.lede}>
            Upload your documents once. Fillmore reads them, fills any web form in seconds, asks when it isn’t sure, and
            leaves the Submit button to you.
          </p>
          <WaitlistForm id="waitlist-hero" dark />
          <PlayFilmButton className={styles.play}>
            <span className={styles.disc} aria-hidden>
              <svg width="14" height="16" viewBox="0 0 14 16">
                <path d="M1 1.5v13l12-6.5z" fill="currentColor" />
              </svg>
            </span>
            <span>
              Watch Fillmore’s story<small>45-second short film</small>
            </span>
          </PlayFilmButton>
        </div>
        <div ref={artRef} className={styles.heroArt} aria-hidden />
      </div>
    </section>
  );
}

/** The ink-splash film overlay. Mount once per page. */
export function FillmoreFilm() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const [live, setLive] = useState(false);
  const [ui, setUi] = useState(false);
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!canvasRef.current) return;
    const film = createFilm(canvasRef.current, loadPenguin(), {
      onStart: () => {
        setLive(true);
        document.body.dataset.film = "on";
        document.body.style.overflow = "hidden";
        skipRef.current?.focus({ preventScroll: true });
      },
      onUi: setUi,
      onTime: setTime,
      onEnd: (finished) => {
        setLive(false);
        setTime(0);
        delete document.body.dataset.film;
        document.body.style.overflow = "";
        if (finished) {
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          document.getElementById("join")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        }
      },
    });
    const onPlay = (e: Event) => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      film.play(x, y);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") film.close();
    };
    const onSkip = () => film.close();
    const skip = skipRef.current;
    window.addEventListener(PLAY_EVENT, onPlay);
    window.addEventListener("keydown", onKey);
    skip?.addEventListener("click", onSkip);
    return () => {
      film.destroy();
      window.removeEventListener(PLAY_EVENT, onPlay);
      window.removeEventListener("keydown", onKey);
      skip?.removeEventListener("click", onSkip);
      delete document.body.dataset.film;
      document.body.style.overflow = "";
    };
  }, []);

  const subtitle = FILM_SUBTITLES.find(([a, b]) => time >= a && time < b)?.[2] ?? "";

  return (
    <div
      className={`${styles.film} ${live ? styles.filmLive : ""}`}
      role="dialog"
      aria-modal={live}
      aria-hidden={!live}
      aria-label="Fillmore and the 47-field form, a short film"
    >
      <canvas ref={canvasRef} />
      <div className={`${styles.filmUi} ${ui ? styles.filmUiOn : ""}`}>
        <button ref={skipRef} type="button" className={styles.skip} tabIndex={live ? 0 : -1}>
          Skip ✕
        </button>
        <p className={styles.sub} aria-live="polite">
          {subtitle && <span>{subtitle}</span>}
        </p>
        <div className={styles.bar}>
          <i style={{ width: `${(time / FILM_LENGTH) * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
