import Link from "next/link";
import { getPerson, team } from "@/content/team";

export function Avatar({ slug, size = 40 }: { slug: string; size?: number }) {
  const person = getPerson(slug);
  return (
    <span
      title={person.name}
      className="inline-flex shrink-0 items-center justify-center rounded-full border-[3px] border-paper font-bold"
      style={{ width: size, height: size, background: person.tint, color: person.onTint, fontSize: size * 0.32 }}
    >
      {person.initials}
    </span>
  );
}

export function AvatarStack({ slugs = team.map((p) => p.slug), size = 56 }: { slugs?: string[]; size?: number }) {
  return (
    <span className="avatars flex items-center" style={{ marginLeft: size * 0.25 }}>
      {slugs.map((slug) => (
        <span key={slug} style={{ marginLeft: -size * 0.25 }}>
          <Avatar slug={slug} size={size} />
        </span>
      ))}
    </span>
  );
}

export function Byline({ authors, linked = true }: { authors: string[]; linked?: boolean }) {
  const people = authors.map(getPerson);
  const names = people.map((p) =>
    linked ? (
      <Link key={p.slug} href={`/about#${p.slug}`} className="link-draw text-ink">
        {p.name}
      </Link>
    ) : (
      <span key={p.slug} className="text-ink">
        {p.name}
      </span>
    ),
  );
  const joined = names.flatMap((n, i) => (i === 0 ? [n] : [i === names.length - 1 ? " & " : ", ", n]));

  return (
    <span className="inline-flex flex-wrap items-center gap-3">
      <AvatarStack slugs={authors} size={32} />
      <span>{joined}</span>
    </span>
  );
}
