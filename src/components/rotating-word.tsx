"use client";

import { useEffect, useState } from "react";

/** Cycles through words with a soft blur-and-slide. Screen readers get the first word only. */
export function RotatingWord({ words, interval = 2600 }: { words: string[]; interval?: number }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => window.clearInterval(id);
  }, [words.length, interval]);

  return (
    <>
      <span className="sr-only">{words[0]}</span>
      <span className="rotator" aria-hidden>
        {words.map((word, i) => {
          const prev = (index - 1 + words.length) % words.length;
          const state = i === index ? "on" : i === prev ? "out" : "in";
          return (
            <span key={word} data-state={state}>
              {word}
            </span>
          );
        })}
      </span>
    </>
  );
}
