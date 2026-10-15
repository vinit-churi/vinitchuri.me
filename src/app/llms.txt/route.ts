import { agents } from "@/content/agents";
import { posts } from "@/content/posts";
import { products } from "@/content/products";
import { absoluteUrl, site } from "@/content/site";

export const dynamic = "force-static";

/** A plain-language map of the site for AI assistants and crawlers (llmstxt.org). */
export function GET() {
  const body = `# ${site.name}

> ${site.description}

${site.name} is a software engineer based in ${site.city}, India. TraceSarkar and the Fillmore agent are solo projects; ReelForge and Hookline are built with Kenil Joshi. He is also part of Logicvell (https://logicvell.com), where he led the ViharSync V2 rebuild.

## Products

${products
  .map(
    (p) =>
      `- [${p.name}](${absoluteUrl(`/work/${p.slug}`)}): ${p.oneLiner} Status: ${p.status}. Built: ${p.credit}. Site: ${p.url}. Built with ${p.stack.join(", ")}.`,
  )
  .join("\n")}

## Agents (in development, none shipped yet)

${agents.map((a) => `- ${a.href ? `[${a.name}](${absoluteUrl(a.href)})` : a.name} (${a.status}): ${a.oneLiner}`).join("\n")}

## Writing

${posts.map((p) => `- [${p.title}](${absoluteUrl(`/writing/${p.slug}`)}): ${p.dek}`).join("\n")}

## Pages

- [About](${absoluteUrl("/about")}): who Vinit is, who he builds with, and how he works
- [Now](${absoluteUrl("/now")}): what each product is doing this month
- [RSS](${absoluteUrl("/rss.xml")})

## Contact

${site.email}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
