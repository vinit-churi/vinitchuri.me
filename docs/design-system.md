# Design system — “Field Notes”

Inherited from Logicvell, made personal: warm paper, big confident type, one serif voice for asides, each product
carrying its own colour. The accent is Fillmore’s scarf red (`#c8302a`) instead of Logicvell’s blue.

## Tokens (`src/app/globals.css`, `@theme inline`)

| Token | Value | Use |
| --- | --- | --- |
| `paper` | `#faf8f3` | Page background |
| `paper-deep` | `#f2efe7` | Inset panels, callouts, featured post |
| `ink` | `#1a1a18` | Text, dark panels |
| `ink-soft` | `#3d3b36` | Body copy |
| `muted` | `#5b5953` | Secondary text, mono labels |
| `line` | `#ddd8cc` | Rules and borders |
| `accent` | `#3b2fd9` | The dot in “logicvell.”, links, numerals |
| `trace` / `vihar` / `reel` | `#f2c230` / `#2f6e55` / `#e8573a` | Product colours (art tiles, CTAs, reading-progress bar) |

## Type

- **Hanken Grotesk** (`font-sans`) — headings at 700 with tight negative tracking, and body copy.
- **Instrument Serif italic** (`font-serif italic`) — section titles (“Things we’ve made”, “Writing”) and asides in headlines.
- **JetBrains Mono** (`font-mono`) — small metadata: dates, kickers, categories.

## Micro-interactions

All respect `prefers-reduced-motion`.

- `.link-draw` underline draws in on hover; `.nudge` arrows move forward on hover of a `.group`.
- `<Reveal>` fades content up once on scroll (content stays visible without JavaScript).
- `<RotatingWord>` in the home headline; header shrinks to a blurred bar on scroll; mobile menu staggers in.
- Product art (`<ProductArt>`) animates on hover — the pin lifts, windows switch on, the playhead travels — and
  morphs between the work list and the product page with React `<ViewTransition>` (`experimental.viewTransition`).
- Reading-progress bar in the product’s colour on posts; heading anchors appear on hover; avatar stacks fan out.

## Content

- Products: `src/content/products.ts` (story, how it works, decisions, numbers, dated journey).
- Team: `src/content/team.ts`. Site constants: `src/content/site.ts`.
- Posts: one `.tsx` file per post in `src/content/posts/`, exporting `meta` and a default body built from
  `src/components/prose.tsx` (`H2`, `Lede`, `Callout`, `Code`, `Steps`, `Stats`, `Quote`). Register new posts in
  `src/content/posts/index.ts`.

Every fact in the content should be traceable to the product’s repository or docs. Don’t publish unverified numbers.
