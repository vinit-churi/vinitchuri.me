import Link from "next/link";
import { stages, type Product, type Stage } from "@/content/products";

/** Where a product is: the stages it has been through, the one it is in now, and its latest step. */
function position(product: Product) {
  const done = new Set<Stage>(product.journey.filter((e) => !e.next).map((e) => e.stage));
  const next = product.journey.find((e) => e.next);
  const latest = product.journey
    .filter((e) => !e.next && e.date)
    .sort((a, b) => Date.parse(b.date!) - Date.parse(a.date!))[0];
  return { done, now: next?.stage, next, latest };
}

export function StageBoard({ products }: { products: Product[] }) {
  return (
    <div className="border-b border-line">
      <div className="hidden grid-cols-[180px_repeat(5,1fr)] gap-2 pb-3 font-mono text-xs text-muted md:grid">
        <span />
        {stages.map((s) => (
          <span key={s}>{s}</span>
        ))}
      </div>
      <ul>
        {products.map((product) => {
          const { done, now, next, latest } = position(product);
          return (
            <li key={product.slug} className="border-t border-line">
              <Link
                href={`/work/${product.slug}`}
                className="group grid gap-x-2 gap-y-3 py-5 md:grid-cols-[180px_repeat(5,1fr)] md:items-center"
              >
                <span className="flex items-center gap-2.5 text-lg font-bold tracking-[-0.02em]">
                  <span className="size-3 rounded-full" style={{ background: product.color }} aria-hidden />
                  {product.name}
                  <span className="nudge text-muted">→</span>
                </span>
                <span className="grid grid-cols-5 gap-1 md:contents" aria-label={`${product.name}: now at ${now ?? "the last stage"}`}>
                  {stages.map((s) => (
                    <span
                      key={s}
                      className={`h-2 rounded-full transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-y-150 ${
                        s === now
                          ? "pulse-dot bg-accent text-accent"
                          : done.has(s)
                            ? "bg-ink"
                            : "bg-line"
                      }`}
                      title={s}
                    />
                  ))}
                </span>
                <span className="flex flex-col gap-1 text-[15px] leading-normal text-muted md:col-start-2 md:col-end-7">
                  {next && (
                    <span>
                      <span className="font-semibold text-ink">Now · {next.stage}:</span> {next.title}
                    </span>
                  )}
                  {latest && (
                    <span className="font-mono text-xs">
                      Last step, {latest.date}: {latest.title}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
