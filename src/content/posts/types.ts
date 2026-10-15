import type { ProductSlug } from "../products";

export const categories = ["Building", "Product", "Launch", "Principles"] as const;
export type PostCategory = (typeof categories)[number];

export type PostMeta = {
  slug: string;
  title: string;
  /** One or two sentences shown in lists and as the description. */
  dek: string;
  category: PostCategory;
  product?: ProductSlug;
  authors: string[];
  /** ISO date, yyyy-mm-dd. */
  date: string;
  readingMinutes: number;
};
