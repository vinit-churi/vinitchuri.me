import type { ProductSlug } from "@/content/products";

/** Hand-drawn product marks. Hover states live in globals.css (.art-*), triggered by a parent `.group`. */
export function ProductArt({ slug, className }: { slug: ProductSlug; className?: string }) {
  if (slug === "tracesarkar") {
    return (
      <svg viewBox="0 0 220 200" fill="none" aria-hidden className={className}>
        <path d="M30 196 L95 20 M190 196 L125 20" stroke="#1A1A18" strokeWidth="3" />
        <g className="art-dash">
          <path d="M110 190v-22M110 150v-20M110 112v-18M110 78v-14M110 50v-10" stroke="#1A1A18" strokeWidth="4" />
        </g>
        <ellipse cx="80" cy="150" rx="22" ry="8" fill="#1A1A18" />
        <g className="art-pin">
          <path d="M160 16c-14 0-24 10-24 23 0 17 24 41 24 41s24-24 24-41c0-13-10-23-24-23z" fill="#1A1A18" />
          <circle cx="160" cy="39" r="8" fill="#F2C230" />
        </g>
      </svg>
    );
  }

  if (slug === "hookline") {
    // A strip of reel frames with the hook caught on the one that worked.
    return (
      <svg viewBox="0 0 220 200" fill="none" aria-hidden className={className}>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={14 + i * 50}
            y="112"
            width="42"
            height="74"
            rx="6"
            stroke="#FAF8F3"
            strokeWidth="3"
            fill={i === 2 ? "#FF5A1F" : "transparent"}
            className={i === 2 ? "art-word" : undefined}
          />
        ))}
        <g className="art-pin">
          <path d="M135 14v62c0 14-10 24-22 24s-20-9-20-20" stroke="#FF5A1F" strokeWidth="6" strokeLinecap="round" />
          <path d="M93 80l-9 10M93 80l11 5" stroke="#FF5A1F" strokeWidth="6" strokeLinecap="round" />
          <circle cx="135" cy="12" r="6" stroke="#FF5A1F" strokeWidth="4" />
        </g>
        <path d="M10 196h200" stroke="#FAF8F3" strokeWidth="3" />
      </svg>
    );
  }

  if (slug === "viharsync") {
    const windows: [number, number, boolean][] = [
      [44, 46, true], [70, 46, false], [44, 78, false], [70, 78, true], [44, 110, true], [70, 110, false],
      [44, 142, false], [70, 142, false],
      [134, 80, false], [160, 80, true], [134, 112, true], [160, 112, false], [134, 144, false], [160, 144, true],
    ];
    return (
      <svg viewBox="0 0 220 200" fill="none" aria-hidden className={`text-[#FAF8F3] ${className ?? ""}`}>
        <rect x="30" y="30" width="70" height="160" stroke="currentColor" strokeWidth="3" />
        <rect x="120" y="64" width="70" height="126" stroke="currentColor" strokeWidth="3" />
        {windows.map(([x, y, lit], i) => (
          <rect
            key={i}
            x={x}
            y={y}
            width="16"
            height="16"
            stroke="currentColor"
            strokeWidth="2"
            fill={lit ? "currentColor" : "transparent"}
            className={lit ? (i % 3 === 0 ? "art-window-off" : undefined) : i % 2 ? "art-window" : undefined}
          />
        ))}
        <path d="M0 190h220" stroke="currentColor" strokeWidth="3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 220 200" fill="none" aria-hidden className={className}>
      <rect x="72" y="10" width="76" height="136" rx="14" stroke="#1A1A18" strokeWidth="3" />
      <rect x="44" y="96" width="132" height="22" rx="4" fill="#1A1A18" />
      <rect className="art-word" x="96" y="100" width="40" height="14" rx="2" fill="#FAF8F3" />
      <path d="M10 176h200" stroke="#1A1A18" strokeWidth="3" />
      <path d="M10 176h70" stroke="#1A1A18" strokeWidth="9" />
      <path className="art-playhead" d="M80 164v24" stroke="#1A1A18" strokeWidth="3" />
    </svg>
  );
}
