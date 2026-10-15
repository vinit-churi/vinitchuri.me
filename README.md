# vinitchuri.me

The personal site of Vinit Churi, an engineer in Mumbai: products (TraceSarkar, Hookline, ReelForge),
the agents in the lab (starting with Fillmore, a form-filling agent), long-form writing and a now page.

Next.js 16 (App Router, Turbopack), React 19, Tailwind CSS 4. Fully static (`output: "export"`),
served as Cloudflare Workers static assets.

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm lint
pnpm deploy     # next build → npx wrangler deploy (serves ./out)
```

## Routes

| Route | What |
| --- | --- |
| `/` | Home: intro, products, agents, how I build, latest writing, now |
| `/work`, `/work/[slug]` | Products and each product’s story and journey |
| `/agents/fillmore` | Fillmore: cloud fly-through hero, ink-splash short film, waitlist |
| `/writing`, `/writing/[slug]` | Blog index (filterable) and posts |
| `/now` | What I’m working on this month |
| `/about` | About me and the people I build with |
| `/rss.xml`, `/sitemap.xml`, `/robots.txt`, `/llms.txt` | Feeds and metadata |

## Content

- Products: `src/content/products.ts`. ViharSync is kept unlisted (it lives on logicvell.com) so its posts still render.
- Agents: `src/content/agents.ts`. Give an agent an `href` once it has a page.
- People: `src/content/team.ts`. Everyone except Vinit appears as a collaborator.
- Posts: add `src/content/posts/<slug>.tsx`, compose it from `src/components/prose.tsx`, register it in `src/content/posts/index.ts`.

## Domain

The canonical origin is `https://vinitchuri.me` (override with `NEXT_PUBLIC_SITE_URL`). It is attached to the
`vinitchuri` Worker as a Custom Domain in `wrangler.jsonc`, so `wrangler deploy` keeps it wired up.

See `docs/design-system.md` for tokens, type and interaction conventions.
