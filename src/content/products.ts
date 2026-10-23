export type ProductSlug = "tracesarkar" | "hookline" | "viharsync" | "reelforge" | "infoyantra";

export const stages = ["Get annoyed", "Research", "Build", "Ship", "Tell people"] as const;
export type Stage = (typeof stages)[number];

export type JourneyEntry = {
  /** Display date, e.g. "10 Aug 2026". Omit for undated milestones. */
  date?: string;
  stage: Stage;
  title: string;
  body: string;
  /** Not done yet. */
  next?: boolean;
};

export type Product = {
  slug: ProductSlug;
  name: string;
  /** Background colour of the product's art tile. */
  color: string;
  /** Text colour that reads on `color`. */
  onColor: string;
  kicker: string;
  status: string;
  url: string;
  urlLabel: string;
  oneLiner: string;
  summary: string;
  problem: string[];
  how: { title: string; body: string }[];
  decisions: { title: string; body: string }[];
  numbers: { value: string; label: string }[];
  stack: string[];
  journey: JourneyEntry[];
  builtBy: string[];
  /** Who it was built with, shown next to the product. */
  credit: string;
  now: string;
  /** Team work that lives on Logicvell: kept for the writing about it, but not listed here. */
  listed?: false;
  /** Planned, not built: no live link, no numbers, no "it runs" claims. */
  concept?: true;
};

const allProducts: Product[] = [
  {
    slug: "tracesarkar",
    name: "TraceSarkar",
    color: "#F2C230",
    onColor: "#1A1A18",
    kicker: "Civic issues · Mumbai",
    status: "Pilot · Borivali · 24 wards routed",
    url: "https://tracesarkar.vinitchuri.me",
    urlLabel: "tracesarkar.vinitchuri.me",
    oneLiner: "Photograph a pothole. Get back who is responsible, what they were paid to do, and what you can do about it.",
    summary:
      "One geotagged photo is classified, matched to the ward and the public road contract that covers it, and turned into a sourced record with the next step drafted — a complaint, an RTI, a share card. The citizen sends it; the platform never does.",
    problem: [
      "Governance failure in the Mumbai region isn’t caused by a shortage of data. It’s caused by a shortage of synthesis and a shortage of consequence.",
      "Five facts about a single pothole — that it exists, which ward owns that stretch, which contract built it, whether it’s still under warranty, and what deadline the law sets — live in five disconnected places: a citizen’s phone, a PDF ward map, a tender portal keyed by tender ID, a defect-liability clause, and a High Court judgment.",
      "In October 2025 the Bombay High Court held that safe roads are part of the right to life and that a reported pothole must be attended to within 48 hours. Structured, timestamped evidence is now directly convertible into consequence. Nobody was producing it.",
    ],
    how: [
      { title: "Capture", body: "The photo and GPS fix are stored before the server even replies. A capture is never lost; everything after it is retryable." },
      { title: "Redact", body: "Faces and number plates are found by detectors that run on our own servers and destroyed with a mosaic — before any image reaches a third-party model." },
      { title: "Classify", body: "A vision model sorts the photo into a closed taxonomy. Below 0.65 confidence it asks the user instead of guessing. Models that train on inputs are refused by code." },
      { title: "Locate", body: "PostGIS finds the ward from BMC’s own boundary polygons — then checks the distance to the ward line against the phone’s GPS error before it trusts the answer." },
      { title: "Attribute", body: "The point is matched to BMC’s road-works geometry and the contract behind it, reported in confidence bands, never a falsely precise percentage." },
      { title: "Act", body: "A complaint, an RTI draft, a WhatsApp card and an evidence PDF are generated from the facts — with no language model in the path. You decide what to send." },
    ],
    decisions: [
      { title: "Precision over recall", body: "A wrong contractor name published next to a pothole is a defamation fact pattern. A missing one costs a feature. Every gate is built to ask rather than guess." },
      { title: "No model writes the share post", body: "A model would write better sentences than a template. It would also, eventually, write a fact. The failure mode we chose is a stilted sentence, not a false one." },
      { title: "Legal constants are data", body: "The 48-hour pothole deadline isn’t a literal in Go. Every SLA, fee and limit lives in a versioned table with an effective date and a citation." },
      { title: "Snap, never jitter", body: "Public positions are snapped to a ~111 m grid. Random jitter leaks: publish the same point enough times and the average converges on the truth." },
    ],
    numbers: [
      { value: "98.17%", label: "of 2,405 BMC road works resolved to the right ward" },
      { value: "50/50", label: "contract matches judged right by a human reviewer, none naming the wrong contractor" },
      { value: "4,878", label: "BMC road works archived, write-once, twice a day" },
    ],
    stack: ["Go", "PostgreSQL + PostGIS", "Flutter", "Cloud Run", "Cloudflare R2 + Workers", "Vision-language models"],
    journey: [
      { date: "10 Aug 2026", stage: "Get annoyed", title: "Six weeks of writing before any code", body: "The first commit was a vision, a problem statement and a research pack — the legal context, the data sources, the personas. No code until the idea survived on paper." },
      { date: "24 Aug 2026", stage: "Research", title: "BMC’s open roads API", body: "A data-availability audit turned up BMC’s own road-works geometry. That made the contract join a database problem, not a policy problem." },
      { date: "23 Sep 2026", stage: "Build", title: "First code", body: "Scaffold, config, a write-once archive in R2, migrations. Built one system at a time — only one open at any moment, each with a bar it had to meet." },
      { date: "24 Sep 2026", stage: "Build", title: "BMC blocks foreign clouds", body: "The first CI run failed because BMC filters by geography. Collection moved to Mumbai, then to a scheduled Cloud Run job in asia-south1." },
      { date: "29 Sep 2026", stage: "Ship", title: "A host died; the bars were met", body: "Four days after we wrote down the risk, the shared host died. The API moved to Cloud Run. Same day: attribution and jurisdiction met their measured bars, and the pilot moved to Borivali." },
      { date: "5 Oct 2026", stage: "Build", title: "Real photographs, real bugs", body: "The first two real captures found three bugs the synthetic probes never could — including a road contractor named next to a garbage report. Probes test the join; photographs test the product." },
      { date: "14 Oct 2026", stage: "Ship", title: "Share kit, evidence PDF, all 24 wards", body: "Posts in English, Marathi and Hindi generated from facts, a deterministic evidence PDF, and road-defect routing for every BMC ward." },
      { date: "23 Oct 2026", stage: "Ship", title: "The Filing agent", body: "From a photo to the complaint itself: the right desk, the contract, the deadline, every fact sourced, drafted for you to send. If the deadline passes, the escalation to the ward’s Assistant Commissioner is drafted too. Nothing is ever filed for you." },
      { stage: "Tell people", title: "One RWA, one journalist, one story", body: "No paid acquisition: growth comes from the share. Next is recruiting a handful of RWA secretaries and a public v0.1 before the 2027 monsoon.", next: true },
    ],
    builtBy: ["vinit-churi"],
    credit: "Solo",
    now: "The Filing agent is live. Next: lodging the first real complaints through it, and recruiting the first RWA secretaries for the Borivali pilot.",
  },
  {
    slug: "hookline",
    name: "Hookline",
    color: "#0B0B0C",
    onColor: "#FAF8F3",
    kicker: "Agentic video studio · Businesses",
    status: "Research · landing page live",
    url: "https://hookline-landing.infoyantra.workers.dev",
    urlLabel: "See Hookline",
    oneLiner: "Steal the formula, not the video. Decode a reel that worked and rebuild it from your own clips.",
    summary:
      "Hookline decodes reels that worked, turns each one into a template, and builds yours from your own clips — one reel by chat, or a hundred from a spreadsheet. A real editor runs in the browser tab, on your GPU.",
    problem: [
      "Every business is told to post reels. Almost none of them know why one reel works and the next one dies — the hook, the pacing, the order of the shots, where the ask lands.",
      "The usual answer is to copy a trend by hand, one video at a time. We wanted to read the formula out of a reel that already worked, and then make as many versions of it as a business needs.",
    ],
    how: [
      { title: "Find", body: "Paste a link or upload a reel that worked, yours or anyone’s." },
      { title: "Decode", body: "Frame by frame: the hook, the beats, the pacing, the text, the music, and why it fits that business." },
      { title: "Template", body: "The formula becomes a template with slots for your clips, your lines, your offer and your brand." },
      { title: "Run", body: "One reel by chat with an agent that controls the timeline, or a hundred from a sheet. Edit any of them by hand." },
      { title: "Learn", body: "See which versions held attention. The next batch starts from the winner." },
    ],
    decisions: [
      { title: "The agent plans before it cuts", body: "You see what it will change before it changes it, and every step lands on the timeline where ⌘Z can undo it." },
      { title: "A real editor, in a tab", body: "Multitrack timeline, word-timed captions and frame-accurate trims, composited with WebGPU and decoded with WebCodecs." },
      { title: "Footage stays on your machine", body: "Clips live in the browser’s private storage while you edit. Bulk renders go to the cloud only when you ask." },
      { title: "Templates, not one-offs", body: "A decoded reel is worth more as a template than as a copy: slots for clips, text, price and call to action." },
    ],
    numbers: [
      { value: "5", label: "ways in: ask, edit, template, automate, learn" },
      { value: "1", label: "template can fill a hundred videos from a sheet" },
      { value: "0", label: "uploads needed to edit: footage stays in your browser" },
    ],
    stack: ["Next.js", "WebGPU", "WebCodecs", "OPFS", "Cloudflare Workers", "AI agents"],
    journey: [
      { stage: "Get annoyed", title: "Why did that reel work?", body: "Businesses copy trends by hand without knowing which part made the original work. That question became the product." },
      { date: "14 Oct 2026", stage: "Ship", title: "The landing page goes live", body: "Hookline’s story in public: decode, five ways to make a video, and the learning loop." },
      { stage: "Build", title: "Private beta", body: "Wiring the prompt and paste forms to a waitlist, then the first decodes with real businesses.", next: true },
    ],
    builtBy: ["vinit-churi", "kenil-joshi"],
    credit: "With Kenil Joshi",
    now: "Studying the market and the tools already out there before the private beta.",
  },
  {
    slug: "viharsync",
    name: "ViharSync",
    color: "#2F6E55",
    onColor: "#FAF8F3",
    kicker: "Housing societies · India",
    status: "Live · V2 in rebuild",
    url: "https://viharsync.com",
    urlLabel: "viharsync.com",
    oneLiner: "Dues, gate and books for Indian housing societies — finally in sync.",
    summary:
      "A resident app for paying dues and raising complaints, a guard app for the gate, and a committee console with a real double-entry ledger. Built so a society can run day to day without WhatsApp groups or Excel.",
    problem: [
      "Most Indian housing societies run on a maintenance spreadsheet, a WhatsApp group and a paper register at the gate. The treasurer chases payments by hand; the secretary can’t prove a notice was served; the auditor reconciles it all once a year.",
      "The rules are real and specific. Maharashtra’s co-operative housing law fixes how each charge is billed, caps interest on arrears at 12% simple, sets clocks for answering complaints and requires proof that members received notices. Spreadsheets don’t know any of that.",
    ],
    how: [
      { title: "Bill", body: "A billing run computes every flat’s charge heads — per flat, per square foot, or the 10% non-occupancy charge — plus interest, numbers the bills and posts them to the ledger in one transaction." },
      { title: "Pay", body: "Residents pay in the app. The payment is confirmed twice — by the checkout signature and by the gateway’s webhook — and settled exactly once, with a PDF receipt." },
      { title: "Account", body: "Every rupee posts a balanced journal entry. Postgres itself refuses an entry that doesn’t add up. Nothing is ever deleted; corrections are reversals." },
      { title: "Run the gate", body: "Residents issue pass codes; guards log walk-ins and residents approve from their phones. A guard only sees a flat’s numbers while a visitor is waiting." },
      { title: "Govern", body: "Notices track who acknowledged them — proof of service. Complaints are numbered and run on the bye-law clocks: acknowledge in 3 days, decide in 7 or 15." },
    ],
    decisions: [
      { title: "Money is integer paise", body: "Every amount is an int64 count of paise, from the database to the Flutter apps. Floats are banned in domain code by a lint rule." },
      { title: "The law, encoded", body: "A CHS can’t bill service charges per square foot; the API refuses it. Interest can’t be configured without citing the General Body resolution that allowed it." },
      { title: "One contract, three clients", body: "A single OpenAPI spec generates the Go server, the Dart client and the TypeScript console. A missing handler is a compile error; an endpoint without a permission stops the server from starting." },
      { title: "Built for coding agents", body: "The V2 stack was chosen so AI coding agents could build it safely — rules live in types, linters, tests and hooks, and nothing finishes while `make check` fails." },
    ],
    numbers: [
      { value: "164", label: "commits in seven days to rebuild V2 from scratch" },
      { value: "130", label: "API operations in one OpenAPI contract" },
      { value: "0", label: "floats anywhere money is touched" },
    ],
    stack: ["Go", "PostgreSQL 18", "Flutter ×2", "Next.js", "OpenAPI codegen", "Razorpay · UPI"],
    journey: [
      { stage: "Get annoyed", title: "Societies run on Excel and WhatsApp", body: "Maintenance chased by hand, notices lost in group chats, gate registers on paper. The kind of problem everyone in a city lives next to." },
      { stage: "Ship", title: "V1 goes live", body: "The first ViharSync — billing, members, expenses and receipts — went live at viharsync.com, built by all four of us." },
      { stage: "Research", title: "Reading the bye-laws", body: "Briefs on Maharashtra’s co-operative housing rules, building spaces, unit merges and real society amenity rulebooks — with every unconfirmed point marked uncertain." },
      { date: "8 Oct 2026", stage: "Build", title: "V2: a rebuild for the ledger and the law", body: "A Go modular monolith on Postgres, one OpenAPI contract, two Flutter apps and a console. Finance, gate, community and society modules landed in parallel on day one." },
      { date: "12 Oct 2026", stage: "Build", title: "Statements a CA would sign", body: "Income & Expenditure, Balance Sheet and Receipts & Payments — with previous-year columns and PDF exports — all read straight from the journal." },
      { date: "13 Oct 2026", stage: "Ship", title: "Deployed, with a building builder", body: "Push notifications through an outbox, Docker deployment, Flutter web on Cloudflare — and a builder that handles stilts, podiums, refuge floors and merged flats." },
      { stage: "Tell people", title: "The launch checklist", body: "Live Razorpay, DLT-registered SMS, Android and iOS store releases, a DPDP-ready privacy policy, a security review.", next: true },
    ],
    builtBy: ["vinit-churi", "kenil-joshi", "abhilash-pal", "abhishek"],
    credit: "With the Logicvell team",
    listed: false,
    now: "Working through the V2 launch checklist — live payments, SMS, store releases.",
  },
  {
    slug: "reelforge",
    name: "ReelForge",
    color: "#E8573A",
    onColor: "#1A1A18",
    kicker: "Short-form video · Creators",
    status: "Live",
    url: "https://reelforge.studio",
    urlLabel: "reelforge.studio",
    oneLiner: "Raw footage in, captioned short-form video out — on its way to an editor that edits for you.",
    summary:
      "Upload a talking-head clip; ReelForge transcribes it, turns the speech into styled, animated captions, lets you drop B-roll and sound over any line, and renders a vertical cut ready for Reels and Shorts.",
    problem: [
      "Short-form video rewards people who post every day and punishes the hours it takes: transcribing, timing captions word by word, hunting for B-roll, exporting in the right shape.",
      "Most tools solve it by uploading everything to someone else’s render farm. That’s slow, expensive to run, and your footage leaves your machine. We wanted the fast part now — and a path to an editor that runs entirely in your browser.",
    ],
    how: [
      { title: "Upload", body: "Clips up to a minute. Phone rotation metadata is respected, a thumbnail is grabbed and the audio extracted to 16 kHz mono." },
      { title: "Transcribe", body: "Speech-to-text with word-level timestamps. If there’s no speech, you’re told so — and the upload doesn’t count against your plan." },
      { title: "Caption", body: "Words are grouped three at a time into caption segments you can restyle and animate — fade, slide, zoom, bounce — previewed live on a canvas." },
      { title: "Layer", body: "Search stock video, images and sound, then pin each asset to the caption segments it should cover, so it lines up with speech by construction." },
      { title: "Render", body: "A worker composes everything — B-roll, audio mix, captions — into a single FFmpeg pass and emails you when the video is ready." },
    ],
    decisions: [
      { title: "Three words per caption", body: "The caption segment is the unit of editing. Captions read punchy, and anything you attach to a segment is timed to speech automatically." },
      { title: "One filter graph", body: "Overlays, audio mix, watermark and burned-in captions happen in one encode — no chain of intermediate files." },
      { title: "A free tier that pays for itself", body: "Free projects keep B-roll in your browser and expire after seven days; paid features are enforced on the server, not trusted from the client." },
      { title: "Experiment before you build", body: "39 standalone experiments de-risk the in-browser editor — WebCodecs, WebGPU, OPFS, on-device speech — before any of it touches the product." },
    ],
    numbers: [
      { value: "1", label: "FFmpeg pass for captions, B-roll, audio and watermark" },
      { value: "39", label: "experiments toward a fully in-browser editor" },
      { value: "₹ / $", label: "priced by location, settled in paise" },
    ],
    stack: ["Python · FastAPI", "Celery + Redis", "FFmpeg + libass", "Next.js on Cloudflare", "WebCodecs · WebGPU", "Razorpay · PostHog"],
    journey: [
      { stage: "Get annoyed", title: "Captions shouldn’t take an hour", body: "Every creator we knew spent longer timing subtitles than recording. That was the whole brief." },
      { date: "4 Oct 2025", stage: "Build", title: "First commit, hackathon-style", body: "Kenil’s first commit was “Full Video Extraction.” 87 commits followed in October alone." },
      { date: "12 Oct 2025", stage: "Build", title: "A frontend on the edge", body: "The web app went onto Cloudflare Workers from day one." },
      { date: "Nov 2025", stage: "Ship", title: "Payments and a cleanup cron", body: "Razorpay orders with a webhook backup, and a job that expires free-tier footage after seven days to keep costs bounded." },
      { date: "Dec 2025", stage: "Ship", title: "B-roll in the render; a real landing page", body: "B-roll composited server-side, project management, and the pricing, features and support pages." },
      { date: "9 Jan 2026", stage: "Tell people", title: "Priced for India and the world", body: "Location-based pricing: INR at home, USD everywhere else." },
      { date: "26 Apr 2026", stage: "Build", title: "Exports move to a worker", body: "Rendering left the request path for Celery and Redis — with timeouts, retries and progress steps the editor can poll." },
      { date: "May 2026", stage: "Research", title: "39 experiments", body: "A programme of standalone apps to prove an editor can run entirely in the browser: decode, composite, cache, mix, export, transcribe." },
      { date: "Sep 2026", stage: "Ship", title: "Stock, sound and email", body: "A stock library across four providers, audio layers, export emails and a free-tier watermark." },
      { stage: "Build", title: "The agentic layer", body: "On-device silence cutting, auto-reframing and smart-cut ranking — the parts of an editor that edit for you — moving from experiments into the product.", next: true },
    ],
    builtBy: ["vinit-churi", "kenil-joshi"],
    credit: "With Kenil Joshi",
    now: "Moving the in-browser editor experiments toward the product — starting with on-device speech and silence cutting.",
  },
  {
    slug: "infoyantra",
    name: "infoyantra",
    color: "#1E3A5F",
    onColor: "#FAF8F3",
    kicker: "Civic data · India",
    status: "Concept · building from Dec 2026",
    url: "https://infoyantra.com",
    urlLabel: "infoyantra.com",
    concept: true,
    oneLiner: "Indian government notices, made machine-readable: every rule sourced to its page, every change tracked.",
    summary:
      "infoyantra will collect official notices — recruitment notifications and their corrigenda first, then schemes and tenders — and turn them into structured data in which every field points to the page and clause it came from. It will watch them for changes. People will use it through change alerts and an eligibility check; software and AI assistants through an API and an MCP server.",
    problem: [
      "Government information in India is public, but it arrives as PDFs — often scanned, often in Marathi or Hindi — spread across hundreds of sites. Working out whether you can apply for something means reading forty pages for the five lines that decide it.",
      "Notices change after they are published. A recruitment notice can be amended twice before it closes, each time by another PDF on the same site. Nobody tells the people who were reading the first one.",
      "Aggregator sites copy the headlines without the source, and official portals each cover one kind of document. Nothing joins them, keeps their history, or answers a question with the clause that decides it.",
    ],
    how: [
      { title: "Collect", body: "Small, polite collectors per official site, run on a schedule. Every file is archived once, by its hash, with where and when it was fetched." },
      { title: "Read", body: "Dates, fees, age limits, vacancies and eligibility rules are pulled out of each notice — rules first, a model only where rules can’t, in English, Marathi and Hindi." },
      { title: "Source", body: "Every value carries the page, the clause and the words it came from. A value without a source is not shown." },
      { title: "Version", body: "A corrigendum is linked to the notice it changes, and the change is worked out field by field: what moved, when, and on which page." },
      { title: "Answer", body: "Change alerts, an eligibility check that cites the clause behind each answer, and an API and MCP server for software and AI assistants." },
    ],
    decisions: [
      { title: "Sourced, not guessed", body: "Every answer quotes the document it came from. When a case is borderline, it says “check the notification” instead of deciding." },
      { title: "Never official, never pretending", body: "No government emblems, a clear “not affiliated” line on every page, and a link to the original document beside every fact." },
      { title: "Polite collection", body: "Each site’s terms and rate limits are read and recorded before anything is collected from it. Login-walled or paid content is never collected." },
      { title: "One kind of document at a time", body: "Recruitment notices and their corrigenda first, end to end, before schemes, and schemes before tenders." },
    ],
    numbers: [],
    stack: ["Go", "PostgreSQL", "Cloud Run", "Cloudflare R2 + Workers", "Document AI", "MCP"],
    journey: [
      { stage: "Get annoyed", title: "A notice that changed twice", body: "A recruitment notice amended twice by corrigenda before it closed, each one another PDF on the same site. Keeping up meant checking by hand." },
      { date: "23 Oct 2026", stage: "Research", title: "The plan, written down", body: "Who has the problem, what already exists, the first sources, the data model, the guardrails and the milestones — before any code." },
      { date: "Dec 2026", stage: "Build", title: "Recruitment notices and their corrigenda", body: "Collectors for about 25 official sites, sourced fields, version history, change alerts and an MCP server.", next: true },
      { stage: "Build", title: "Schemes", body: "The most-used Maharashtra and central schemes on the same engine, with an eligibility check that cites its clauses.", next: true },
      { stage: "Ship", title: "A tender pilot", body: "Tender matching for a handful of small businesses, to learn whether the paid side works.", next: true },
    ],
    builtBy: ["vinit-churi"],
    credit: "Solo",
    now: "Planned and written down. The build starts in December 2026 with recruitment notices and their corrigenda.",
  },
];

/** Everything listed on this site, in order. */
export const products = allProducts.filter((p) => p.listed !== false);

export function getProduct(slug: string) {
  return allProducts.find((p) => p.slug === slug);
}

/** Listed products have a story page here; the rest link to their own site. */
export function productHref(product: Product) {
  return product.listed === false ? product.url : `/work/${product.slug}`;
}
