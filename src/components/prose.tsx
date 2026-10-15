/* Building blocks for long-form writing. Posts compose these inside <div className="prose">. */

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function H2({ children }: { children: string }) {
  const id = slugify(children);
  return (
    <h2 id={id}>
      {children}
      <a href={`#${id}`} className="anchor" aria-label={`Link to “${children}”`}>
        #
      </a>
    </h2>
  );
}

export function H3({ children }: { children: string }) {
  const id = slugify(children);
  return (
    <h3 id={id}>
      {children}
      <a href={`#${id}`} className="anchor" aria-label={`Link to “${children}”`}>
        #
      </a>
    </h3>
  );
}

export function Lede({ children }: { children: React.ReactNode }) {
  return <p className="!text-[1.45rem] !leading-[1.5] text-ink">{children}</p>;
}

export function Callout({ label = "Note", children }: { label?: string; children: React.ReactNode }) {
  return (
    <aside className="rounded-2xl border border-line bg-paper-deep px-6 py-5 text-[1.05rem]">
      <p className="mb-2 font-mono text-xs uppercase tracking-wider text-muted">{label}</p>
      <div className="space-y-3">{children}</div>
    </aside>
  );
}

export function Code({ children, lang }: { children: string; lang?: string }) {
  return (
    <figure className="!my-8 overflow-hidden rounded-2xl bg-ink text-[#EDEBE4]">
      {lang && (
        <figcaption className="border-b border-white/10 px-5 py-2.5 font-mono text-xs text-[#A8A498]">{lang}</figcaption>
      )}
      <pre className="overflow-x-auto px-5 py-4 font-mono text-[0.85rem] leading-relaxed">
        <code>{children.trim()}</code>
      </pre>
    </figure>
  );
}

export function Steps({ items }: { items: { title: string; body: React.ReactNode }[] }) {
  return (
    <ol className="!my-10 !list-none !pl-0">
      {items.map((item, i) => (
        <li key={item.title} className="relative grid grid-cols-[2.5rem_1fr] gap-4 pb-7 last:pb-0">
          {i < items.length - 1 && (
            <span aria-hidden className="absolute top-10 bottom-0 left-[1.2rem] w-px bg-line" />
          )}
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ink font-mono text-sm text-ink">
            {i + 1}
          </span>
          <div className="pt-1.5">
            <p className="font-semibold text-ink">{item.title}</p>
            <div className="mt-1 text-[1.05rem]">{item.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Stats({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="!my-10 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
      {items.map((s) => (
        <div key={s.label} className="bg-paper px-5 py-5">
          <dt className="sr-only">{s.label}</dt>
          <dd className="text-[2.2rem] font-bold leading-none tracking-[-0.04em] text-ink">{s.value}</dd>
          <dd className="mt-2 text-sm leading-snug text-muted">{s.label}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Quote({ children, cite }: { children: React.ReactNode; cite?: string }) {
  return (
    <figure className="!my-10">
      <blockquote>“{children}”</blockquote>
      {cite && <figcaption className="mt-3 font-mono text-xs text-muted">— {cite}</figcaption>}
    </figure>
  );
}
