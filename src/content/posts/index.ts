import type { ComponentType } from "react";
import type { PostMeta } from "./types";

import * as traceBands from "./tracesarkar-bands-not-percentages";
import * as traceNoModel from "./tracesarkar-no-model-in-the-path";
import * as traceSafe from "./tracesarkar-safe-by-construction";
import * as viharLedger from "./viharsync-ledger-in-paise";
import * as viharLaw from "./viharsync-the-law-in-the-software";
import * as viharAgents from "./viharsync-rebuilt-with-agents";
import * as viharLaunch from "./viharsync-launch-checklist";
import * as reelGraph from "./reelforge-one-filter-graph";
import * as reelFreeTier from "./reelforge-free-tier-that-pays";
import * as reelExperiments from "./reelforge-39-experiments";

export type Post = PostMeta & { Body: ComponentType };

const modules = [
  traceBands,
  viharLedger,
  reelExperiments,
  traceNoModel,
  viharAgents,
  reelGraph,
  traceSafe,
  viharLaw,
  reelFreeTier,
  viharLaunch,
];

/** In editorial order: the first post is featured. Dates break ties when they differ. */
export const posts: Post[] = modules
  .map((m) => ({ ...m.meta, Body: m.default }))
  .sort((a, b) => (a.date === b.date ? 0 : a.date < b.date ? 1 : -1));

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function postsForProduct(product: string) {
  return posts.filter((p) => p.product === product);
}

export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );
}

export type { PostMeta } from "./types";
export { categories } from "./types";
