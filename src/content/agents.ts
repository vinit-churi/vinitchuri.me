import type { ProductSlug } from "./products";

export type AgentStatus = "In the lab" | "Concept";

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
};

/**
 * Autonomous agents: each does one job end to end and hands the result to a person.
 * None has shipped yet; keep `status` honest as they move out of the lab.
 */
export const agents: Agent[] = [
  {
    slug: "fillmore",
    name: "Fillmore",
    mark: "FI",
    tint: "#E4E1FB",
    kicker: "Form-filling agent · in your browser",
    oneLiner: "Fills long web forms from your own documents, asks when it isn’t sure, and leaves Submit to you.",
    status: "In the lab",
    href: "/agents/fillmore",
  },
  {
    slug: "coding-agent",
    name: "Coding agent",
    mark: "CO",
    tint: "#E6E3DA",
    kicker: "Agent · for engineering teams",
    oneLiner: "Takes an issue, writes the change and the tests, and opens a pull request for you to review.",
    status: "Concept",
  },
  {
    slug: "caption-agent",
    name: "Caption agent",
    mark: "CA",
    tint: "#FBE3DC",
    kicker: "Agent · for ReelForge",
    product: "reelforge",
    oneLiner: "Turns an upload into a captioned, B-rolled reel for you to approve.",
    status: "Concept",
  },
  {
    slug: "filing-agent",
    name: "Filing agent",
    mark: "FA",
    tint: "#FBF0CC",
    kicker: "Agent · for TraceSarkar",
    product: "tracesarkar",
    oneLiner: "From a photo to a sourced complaint draft that you choose to send.",
    status: "Concept",
  },
];

/** The shape every agent follows, whatever the job. */
export const agentSteps = [
  { title: "Trigger", body: "A form, an upload, a photo — something real starts it." },
  { title: "Plan", body: "It breaks the job into steps it can check." },
  { title: "Use real tools", body: "The same pipelines my products run on: browsers, renderers, maps, documents." },
  { title: "Check its own work", body: "Sources must exist, every field must have one, the render must play." },
  { title: "Hand it to a person", body: "You approve, send or ship. Every run leaves a log you can read." },
] as const;
