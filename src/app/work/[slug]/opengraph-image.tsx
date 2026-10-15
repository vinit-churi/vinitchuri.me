import { getProduct, products } from "@/content/products";
import { ogContentType, ogSize, renderCard } from "@/lib/og";

export const alt = "A product built by Vinit Churi";
export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = "force-static";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug)!;
  return renderCard({
    kicker: `${product.kicker} · ${product.status}`,
    title: product.name,
    subtitle: product.oneLiner,
    footer: `${product.credit} · vinitchuri.me`,
    color: product.color,
    onColor: product.onColor,
  });
}
