import { posts } from "@/content/posts";
import { site } from "@/content/site";
import { getPerson } from "@/content/team";

export const dynamic = "force-static";

function escape(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function GET() {
  const items = posts
    .map((p) => {
      const url = `${site.url}/writing/${p.slug}`;
      const authors = p.authors.map((a) => getPerson(a).name).join(", ");
      return `<item>
  <title>${escape(p.title)}</title>
  <link>${url}</link>
  <guid>${url}</guid>
  <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
  <description>${escape(p.dek)}</description>
  <category>${p.category}</category>
  <dc:creator>${escape(authors)}</dc:creator>
</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${site.name} — Writing</title>
  <link>${site.url}/writing</link>
  <description>${escape(site.description)}</description>
  <language>en-in</language>
  <atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml" />
  <lastBuildDate>${new Date(`${posts[0].date}T00:00:00Z`).toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
