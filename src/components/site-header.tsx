"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open
          ? "bg-paper/85 shadow-[0_1px_0_var(--color-line)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-[1120px] items-center justify-between gap-4 px-6 py-4"
      >
        <Link
          href="/"
          className="group flex items-baseline text-xl font-extrabold tracking-[-0.04em]"
          aria-label="Vinit Churi, home"
        >
          vinit churi
          <span className="inline-block text-accent transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:-translate-y-1.5 group-hover:scale-125">
            .
          </span>
        </Link>

        <ul className="hidden items-center gap-1 text-[15px] sm:flex">
          {nav.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative block rounded-full px-3.5 py-2.5 transition-colors duration-200 hover:bg-paper-deep ${
                    active ? "text-ink" : "text-ink-soft"
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-3.5 bottom-1.5 h-px origin-left bg-ink transition-transform duration-500 ease-[var(--ease-out-soft)] ${
                      active ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="relative -mr-2 flex h-11 w-11 items-center justify-center rounded-full sm:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            aria-hidden
            className={`absolute h-0.5 w-5 bg-ink transition-transform duration-300 ${
              open ? "rotate-45" : "-translate-y-1"
            }`}
          />
          <span
            aria-hidden
            className={`absolute h-0.5 w-5 bg-ink transition-transform duration-300 ${
              open ? "-rotate-45" : "translate-y-1"
            }`}
          />
        </button>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line px-6 pb-6 sm:hidden"
      >
        <ul className="flex flex-col">
          {nav.map((item, i) => (
            <li
              key={item.href}
              className="reveal"
              data-shown={open}
              style={{ "--reveal-delay": `${i * 50}ms` } as React.CSSProperties}
            >
              <Link
                href={item.href}
                className="flex items-center justify-between border-b border-line py-4 text-2xl font-semibold tracking-tight"
              >
                {item.label}
                <span aria-hidden className="text-muted">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
