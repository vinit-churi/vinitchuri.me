import Link from "next/link";
import { getProduct } from "@/content/products";
import type { PostMeta } from "@/content/posts/types";

export function PostRow({ post }: { post: PostMeta }) {
  const product = post.product ? getProduct(post.product) : undefined;
  return (
    <li className="border-t border-line last:border-b">
      <Link
        href={`/writing/${post.slug}`}
        className="group grid gap-x-8 gap-y-2 py-6 transition-[padding] duration-500 ease-[var(--ease-out-soft)] hover:pl-3 sm:grid-cols-[1fr_auto] sm:items-baseline"
      >
        <span>
          <span className="block text-[1.375rem] font-semibold leading-snug tracking-[-0.02em] transition-colors group-hover:text-accent">
            {post.title}
            <span aria-hidden className="nudge ml-2 text-muted opacity-0 transition-opacity group-hover:opacity-100">
              →
            </span>
          </span>
          <span className="mt-1.5 block max-w-2xl text-[15px] leading-relaxed text-muted">{post.dek}</span>
        </span>
        <span className="flex items-center gap-2 font-mono text-xs whitespace-nowrap text-muted">
          {product && (
            <span className="h-2 w-2 rounded-full" style={{ background: product.color }} aria-hidden />
          )}
          {post.category}
          {product ? ` · ${product.name}` : ""}
        </span>
      </Link>
    </li>
  );
}
