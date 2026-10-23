import Link from "next/link";
import { ViewTransition } from "react";
import { ProductArt } from "./product-art";
import type { Product } from "@/content/products";

export function ProductTile({ product, className }: { product: Product; className?: string }) {
  return (
    <ViewTransition name={`art-${product.slug}`} share="morph">
      <div
        className={`art flex items-center justify-center overflow-hidden rounded-[20px] ${className ?? ""}`}
        style={{ background: product.color }}
      >
        <ProductArt slug={product.slug} className="h-[72%] w-auto max-w-[80%]" />
      </div>
    </ViewTransition>
  );
}

export function ProductRow({ product }: { product: Product }) {
  return (
    <Link
      href={`/work/${product.slug}`}
      className="group grid items-center gap-8 border-t border-line py-8 sm:grid-cols-2"
    >
      <ProductTile product={product} className="h-[280px]" />
      <div className="flex flex-col gap-3">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-muted">
          <span>{product.kicker}</span>
          <span>{product.credit}</span>
          <span className="inline-flex items-center gap-1.5">
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${product.concept ? "bg-[#A8A498]" : "pulse-dot bg-[#2f9e6a] text-[#2f9e6a]"}`}
              aria-hidden
            />
            {product.status}
          </span>
        </p>
        <h3 className="text-[2.75rem] leading-none font-bold tracking-[-0.045em]">{product.name}</h3>
        <p className="text-lg leading-relaxed text-ink-soft">{product.oneLiner}</p>
        <span className="mt-1 text-[15px] font-semibold">
          Read the story <span className="nudge">→</span>
        </span>
      </div>
    </Link>
  );
}
