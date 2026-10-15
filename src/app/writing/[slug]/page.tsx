import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Byline } from "@/components/people";
import { PostRow } from "@/components/post-row";
import { ReadingProgress } from "@/components/reading-progress";
import { Reveal } from "@/components/reveal";
import { formatDate, getPost, posts } from "@/content/posts";
import { getProduct, productHref } from "@/content/products";
import { getPerson } from "@/content/team";
import { JsonLd } from "@/components/json-ld";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema, postSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/writing/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const product = post.product ? getProduct(post.product) : undefined;
  const tags = [post.category, ...(product ? [product.name] : [])];
  return {
    ...pageMetadata({
      title: post.title,
      description: post.dek,
      path: `/writing/${post.slug}`,
      image: { url: `/writing/${post.slug}/opengraph-image`, alt: post.title },
      keywords: tags,
      article: {
        publishedTime: post.date,
        authors: post.authors.map((a) => getPerson(a).name),
        section: post.category,
        tags,
      },
    }),
    authors: post.authors.map((a) => ({ name: getPerson(a).name })),
  };
}

export default async function PostPage({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const product = post.product ? getProduct(post.product) : undefined;
  const { Body } = post;
  const more = [
    ...posts.filter((p) => p.slug !== post.slug && p.product && p.product === post.product),
    ...posts.filter((p) => p.slug !== post.slug && p.product !== post.product),
  ].slice(0, 3);

  return (
    <article>
      <JsonLd
        data={[
          postSchema(post, product?.name),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Writing", path: "/writing" },
            { name: post.title, path: `/writing/${post.slug}` },
          ]),
        ]}
      />
      <ReadingProgress color={product?.color} />

      <header className="mx-auto max-w-[760px] px-6 pt-12 sm:pt-16">
        <Link
          href="/writing"
          className="group inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-ink"
        >
          <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">←</span> Writing
        </Link>
        <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs text-muted">
          <span>{post.category}</span>
          {product && (
            <Link
              href={productHref(product)}
              className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 transition-colors hover:border-ink hover:text-ink"
            >
              <span className="h-2 w-2 rounded-full" style={{ background: product.color }} aria-hidden />
              {product.name}
            </Link>
          )}
          <span>
            <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
          </span>
        </p>
        <h1 className="mt-5 animate-[fade-lift_700ms_var(--ease-out-soft)_both] text-[clamp(2.4rem,5.6vw,4rem)] leading-[1] font-bold tracking-[-0.045em]">
          {post.title}
        </h1>
        <p className="mt-6 animate-[fade-lift_700ms_var(--ease-out-soft)_100ms_both] font-serif text-[1.6rem] leading-snug text-ink-soft italic">
          {post.dek}
        </p>
        <div className="mt-8 border-y border-line py-4 text-[15px] text-muted">
          <Byline authors={post.authors} />
        </div>
      </header>

      <div className="prose mx-auto mt-12 max-w-[760px] px-6">
        <Body />
      </div>

      <footer className="mx-auto mt-24 max-w-[760px] px-6">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-paper-deep p-6 sm:p-8">
          <div>
            <p className="font-mono text-xs text-muted">Written by</p>
            <div className="mt-3 text-[15px]">
              <Byline authors={post.authors} />
            </div>
          </div>
          {product && (
            <Link
              href={productHref(product)}
              className="group inline-flex min-h-11 items-center gap-2 rounded-full px-5 font-semibold"
              style={{ background: product.color, color: product.onColor }}
            >
              The {product.name} story <span className="nudge">→</span>
            </Link>
          )}
        </div>
      </footer>

      <section className="mx-auto mt-24 max-w-[1120px] px-6">
        <Reveal>
          <h2 className="mb-6 font-serif text-[2.5rem] italic">Keep reading</h2>
          <ul>
            {more.map((p) => (
              <PostRow key={p.slug} post={p} />
            ))}
          </ul>
        </Reveal>
      </section>
    </article>
  );
}
