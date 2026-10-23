import type { ProductSlug } from "./products";

export type AgentStatus = "Live" | "In progress" | "Concept";

export type Agent = {
  slug: string;
  name: string;
  /** Two-letter mark shown on the card tile. */
  mark: string;
  /** Tile background. */
  tint: string;
  /** Where the agent runs, or which product it works for. */
  kicker: string;
  /** Set when the agent works on top of one of my products. */
  product?: ProductSlug;
  oneLiner: string;
  status: AgentStatus;
  /** The agent's own page, once it has one. */
  href?: string;
  /** Where to install it, once it has shipped. */
  install?: string;
};

/** Fillmore on the Chrome Web Store. */
export const FILLMORE_STORE_URL = "https://chromewebstore.google.com/detail/fillmore/jcdahajlfgjapnefcpbiahabmcappmna";

/**
 * Autonomous agents: each does one job end to end and hands the result to a person.
 * Fillmore has shipped (Chrome Web Store); the Filing agent is being built. Keep `status` honest as they move.
 */
export const agents: Agent[] = [
  {
    slug: "fillmore",
    name: "Fillmore",
    mark: "FI",
    tint: "#E4E1FB",
    kicker: "Form-filling agent · Chrome extension",
    oneLiner: "Fills long web forms from your own documents, asks when it isn’t sure, and leaves Submit to you.",
    status: "Live",
    href: "/agents/fillmore",
    install: FILLMORE_STORE_URL,
  },
  {
    slug: "filing-agent",
    name: "Filing agent",
    mark: "FA",
    tint: "#FBF0CC",
    kicker: "Agent · for TraceSarkar",
    product: "tracesarkar",
    oneLiner: "From a photo to a sourced complaint draft that you choose to send.",
    status: "In progress",
  },
];
