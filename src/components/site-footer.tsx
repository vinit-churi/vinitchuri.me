import Link from "next/link";
import { nav, site } from "@/content/site";
import { products } from "@/content/products";
import { LocalClock } from "./local-clock";

export function SiteFooter() {
  return (
    <footer className="mt-36 border-t border-line">
      <div className="mx-auto grid max-w-[1120px] gap-12 px-6 pt-16 pb-10 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" className="group inline-flex items-baseline text-3xl font-extrabold tracking-[-0.05em]">
            vinit churi
            <span className="inline-block text-accent transition-transform duration-500 group-hover:-translate-y-2">.</span>
          </Link>
          <p className="mt-4 max-w-sm text-[15px] leading-relaxed text-muted">
            An engineer in Mumbai finding real problems and building my way out of them — products, and agents.
          </p>
          <p className="mt-6 font-mono text-xs text-muted">
            <LocalClock city={site.city} timeZone={site.timeZone} />
          </p>
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Made</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/work/${p.slug}`} className="link-draw">
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-mono text-xs uppercase tracking-wider text-muted">Site</h2>
          <ul className="mt-4 space-y-2.5 text-[15px]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-draw">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href="/rss.xml" className="link-draw">
                RSS
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1120px] flex-wrap items-center justify-between gap-4 border-t border-line px-6 py-6 text-sm text-muted">
        <span>© {new Date().getFullYear()} Vinit Churi</span>
        <div className="flex flex-wrap gap-5">
          <a href={`mailto:${site.email}`} className="link-draw">
            {site.email}
          </a>
          {site.social.map((s) => (
            <a key={s.label} href={s.href} className="link-draw" rel="noreferrer" target="_blank">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
