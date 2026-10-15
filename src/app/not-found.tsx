import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[760px] px-6 pt-28 text-center">
      <p className="font-mono text-xs text-muted">404</p>
      <h1 className="mt-4 text-[clamp(3rem,9vw,6rem)] leading-[0.92] font-bold tracking-[-0.055em]">
        This road isn’t on <span className="font-serif font-normal tracking-[-0.02em] italic">any contract.</span>
      </h1>
      <p className="mt-6 text-xl text-ink-soft">
        I looked within 15 metres plus your GPS error. Nothing. Let’s get you somewhere I know.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/" className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-paper">
          Home
        </Link>
        <Link href="/writing" className="inline-flex min-h-12 items-center rounded-full border border-line px-6 font-semibold hover:border-ink">
          Writing
        </Link>
      </div>
    </div>
  );
}
