import type { ProductSlug } from "./products";

export type Person = {
  slug: string;
  name: string;
  initials: string;
  role: string;
  products: ProductSlug[];
  /** Short bio. Everyone except Vinit appears here as a collaborator. */
  bio: string;
  tint: string;
  /** Text colour that reads on `tint`. */
  onTint: string;
};

export const team: Person[] = [
  {
    slug: "vinit-churi",
    name: "Vinit Churi",
    initials: "VC",
    role: "Engineer · Mumbai",
    products: ["tracesarkar", "hookline", "reelforge"],
    bio: "Built TraceSarkar end to end and is building Fillmore alone. Builds ReelForge and Hookline with Kenil, and led the ViharSync V2 rebuild at Logicvell.",
    tint: "#F2C230",
    onTint: "#1A1A18",
  },
  {
    slug: "kenil-joshi",
    name: "Kenil Joshi",
    initials: "KJ",
    role: "Engineer",
    products: ["reelforge", "hookline"],
    bio: "Co-built ReelForge from its very first commit — the video pipeline on day one — and is building Hookline with Vinit.",
    tint: "#E8573A",
    onTint: "#1A1A18",
  },
  {
    slug: "abhilash-pal",
    name: "Abhilash Pal",
    initials: "AP",
    role: "Engineer",
    products: ["viharsync"],
    bio: "Part of the ViharSync team that took housing-society admin off spreadsheets and WhatsApp.",
    tint: "#2F6E55",
    onTint: "#FAF8F3",
  },
  {
    slug: "abhishek",
    name: "Abhishek",
    initials: "A",
    role: "Engineer",
    products: ["viharsync"],
    bio: "Part of the ViharSync team that took housing-society admin off spreadsheets and WhatsApp.",
    tint: "#3B2FD9",
    onTint: "#FAF8F3",
  },
];

export function getPerson(slug: string) {
  const person = team.find((p) => p.slug === slug);
  if (!person) throw new Error(`Unknown person: ${slug}`);
  return person;
}
