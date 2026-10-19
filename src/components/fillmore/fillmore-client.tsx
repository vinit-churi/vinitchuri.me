"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styles from "@/app/agents/fillmore/fillmore.module.css";
import { FILLMORE_STORE_URL } from "@/content/agents";
import { FILM_LENGTH, FILM_SUBTITLES, POSES, createFilm, startSky, type Art, type Cast, type Pose } from "./engine";

export const FILLMORE_IMAGE = POSES.hero.src;
const PLAY_EVENT = "fillmore:play";

function loadArt(pose: Pose): Art {
  const { src, ...fit } = POSES[pose];
  const img = new Image();
  img.src = src;
  // Decode ahead of time so a pose never pops in half-drawn mid-scene.
  img.decode().catch(() => {});
  return { img, ...fit };
}

function loadCast(): Cast {
  return Object.fromEntries((Object.keys(POSES) as Pose[]).map((p) => [p, loadArt(p)])) as Cast;
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

/** The one thing to do on this page: install it. Opens the Chrome Web Store in a new tab. */
export function InstallButton({ dark, note = true }: { dark?: boolean; note?: boolean }) {
  return (
    <div className={`${styles.install} ${dark ? styles.dark : ""}`}>
      <a className={styles.installBtn} href={FILLMORE_STORE_URL} target="_blank" rel="noopener noreferrer">
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 3v12m0 0-5-5m5 5 5-5M5 21h14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Add to Chrome — free
      </a>
      {note && <span className={styles.installNote}>No account. Your details stay on your device.</span>}
    </div>
  );
}

export function FillmoreHero() {
  const heroRef = useRef<HTMLElement>(null);
  const skyRef = useRef<HTMLCanvasElement>(null);
  const artRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current || !skyRef.current || !artRef.current) return;
    return startSky(skyRef.current, heroRef.current, artRef.current, loadArt("hero"));
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} aria-labelledby="fillmore-title">
      <canvas ref={skyRef} className={styles.sky} aria-hidden />
      <div className={`mx-auto max-w-[1120px] px-6 ${styles.heroGrid}`}>
        <div className={styles.heroCopy}>
          <p className={styles.crumb}>
            <Link href="/#agents">Agents</Link> / Form-filling agent
          </p>
          <span className={`${styles.status} ${styles.live}`}>
            <i aria-hidden />
            Live on the Chrome Web Store · free
          </span>
          <h1 id="fillmore-title" className={styles.title}>
            Fillmore<em>The form-filling agent that lives in your browser.</em>
          </h1>
          <p className={styles.lede}>
            Add your documents once. Fillmore reads them on your device, fills long web forms in seconds, asks when it
            isn’t sure, and leaves the Submit button to you.
          </p>
          <InstallButton dark />
          <PlayFilmButton className={styles.play}>
            <span className={styles.disc} aria-hidden>
              <svg width="14" height="16" viewBox="0 0 14 16">
                <path d="M1 1.5v13l12-6.5z" fill="currentColor" />
              </svg>
            </span>
            <span>
              Watch Fillmore’s story<small>{FILM_LENGTH}-second short film</small>
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
    const film = createFilm(canvasRef.current, loadCast(), {
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
          document.getElementById("install")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
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
