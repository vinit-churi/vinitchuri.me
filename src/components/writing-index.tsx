"use client";

import { useState } from "react";
import { PostRow } from "./post-row";
import type { PostMeta } from "@/content/posts/types";
import { categories } from "@/content/posts/types";

type Filter = "All" | (typeof categories)[number];

export function WritingIndex({ posts }: { posts: PostMeta[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const filters: Filter[] = ["All", ...categories];
  const shown = filter === "All" ? posts : posts.filter((p) => p.category === filter);

  return (
    <div>
      <div role="group" aria-label="Filter by kind" className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => {
          const active = f === filter;
          const count = f === "All" ? posts.length : posts.filter((p) => p.category === f).length;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={`min-h-11 rounded-full border px-4 text-[15px] transition-[background-color,color,border-color,transform] duration-300 active:scale-95 ${
                active ? "border-ink bg-ink text-paper" : "border-line text-ink-soft hover:border-ink"
              }`}
            >
              {f}
              <span className={`ml-2 font-mono text-xs ${active ? "text-paper/70" : "text-muted"}`}>{count}</span>
            </button>
          );
        })}
      </div>
      <ul key={filter} className="animate-[fade-lift_400ms_ease]">
        {shown.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </ul>
    </div>
  );
}
