import { formatDate, getPost, posts } from "@/content/posts";
import { getProduct } from "@/content/products";
import { getPerson } from "@/content/team";
import { ogContentType, ogSize, renderCard } from "@/lib/og";

export const alt = "An article by Vinit Churi";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug)!;
  const product = post.product ? getProduct(post.product) : undefined;
  const authors = post.authors.map((a) => getPerson(a).name).join(", ");
  return renderCard({
    kicker: `${post.category}${product ? ` · ${product.name}` : ""} · ${post.readingMinutes} min read`,
    title: post.title,
    footer: `${authors} · ${formatDate(post.date)}`,
    color: product?.color ?? "#3b2fd9",
    onColor: product?.onColor ?? "#faf8f3",
    bandLabel: product?.name ?? "Journal",
  });
}
