import { Callout, Code, H2, H3, Lede, Quote, Steps } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "reelforge-39-experiments",
  title: "39 experiments toward a video editor with no servers",
  dek: "WebCodecs, WebGPU, OPFS and on-device AI: how we’re de-risking an editor that runs entirely in the browser — and where the agentic part of ReelForge will come from.",
  category: "Building",
  product: "reelforge",
  authors: ["vinit-churi", "kenil-joshi"],
  date: "2026-10-14",
  readingMinutes: 11,
};

export default function Post() {
  return (
    <>
      <Lede>
        Today, ReelForge renders on our servers. That works, but it means your footage travels to us, every export costs
        us compute, and the editor can only be as fast as an upload. Browsers can now decode video in hardware, run GPU
        shaders and run small AI models. So we asked: could the whole editor live in a tab?
      </Lede>

      <p>
        Rather than start building and discover the hard parts halfway through, we wrote the rule down first:{" "}
        <em>do not skip experiments; each one exposes specific pitfalls</em>. Between May and June 2026 we built 39
        standalone apps, each proving — or disproving — one piece.
      </p>

      <H2>The architecture we’re aiming for</H2>
      <Code lang="the target shape">{`
Main thread ── React UI, timeline state (no playhead re-renders)
 │
 ├─ RenderWorker ── WebGPU compositor (WGSL)
 │                  frame cache: VRAM textures → RAM bitmaps
 ├─ DecodeWorker ── VideoDecoder + demuxer, byte-range reads from OPFS
 ├─ AudioWorker  ── SharedArrayBuffer ring → AudioWorklet (the master clock)
 ├─ ProxyWorker  ── 720p all-I-frame proxies for instant scrubbing
 └─ AIWorker     ── ONNX on WebGPU: masks, speech, detection
`}</Code>
      <p>Five principles hold it together:</p>
      <Steps
        items={[
          { title: "Local-first", body: "Media stays on your disk. The Origin Private File System is the I/O layer." },
          { title: "Worker-isolated rendering", body: "The compositor runs in a dedicated worker and never blocks the UI." },
          { title: "Zero-copy", body: "A decoded VideoFrame goes straight into a GPU texture without a round trip through the CPU." },
          { title: "Streaming I/O", body: "Files are read in byte-range chunks; nothing is loaded whole into RAM." },
          { title: "Proxy-first playback", body: "Scrub low-res proxies; export from the originals." },
        ]}
      />

      <H2>What the experiments taught us</H2>
      <H3>Decoding is full of foot-guns</H3>
      <p>
        <code>VideoDecoder.flush()</code> resolves before all the frames have actually arrived. Frames must be fed in
        decode order but tagged with presentation time. And every <code>VideoFrame</code> must be closed by hand — leak a
        few at 4K and the GPU process falls over. A dedicated backpressure experiment exists just to prove 4K60 decode
        doesn’t grow VRAM.
      </p>
      <H3>Two demuxers, one verdict</H3>
      <p>
        We built the same seek index with mp4box.js and mediabunny. Verdict: mediabunny for the decode path, mp4box where
        we need raw byte offsets, which mediabunny doesn’t expose.
      </p>
      <H3>The GPU is fast; the bus isn’t</H3>
      <p>
        Drawing frames through Canvas2D at 1080p60 moves roughly half a gigabyte a second across the bus for nothing.{" "}
        <code>importExternalTexture</code> avoids the copy — with the catch that external textures expire every frame,
        so the bind group has to be rebuilt each time.
      </p>
      <H3>React shouldn’t know where the playhead is</H3>
      <p>
        With 500 clips on a timeline, re-rendering on every frame is hopeless. Keeping the playhead in refs, outside React
        state, was the single biggest performance win of the whole programme.
      </p>
      <H3>Crashes are a design input</H3>
      <p>
        A project journal in OPFS replays edits after a crash, because <code>beforeunload</code> is not enough. Web Locks
        keep one tab as the writer. And when the GPU device is lost, the compositor rebuilds itself from a resource
        registry — but gives up after five losses in ten seconds rather than flapping forever.
      </p>

      <H2>Where “agentic” comes from</H2>
      <p>
        The experiments we’re most excited about aren’t plumbing. They’re the pieces of an editor that edits for you —
        all running on your device:
      </p>
      <ul>
        <li>
          <strong>Speech-to-text</strong> with Whisper-tiny and Moonshine on WebGPU — weights downloaded once and cached.
        </li>
        <li>
          <strong>Silence cutting</strong> with a ~2 MB voice-activity model and hysteresis so cuts don’t chatter.
        </li>
        <li>
          <strong>Auto-reframe</strong> from 16:9 to 9:16, tracking the subject with a small detector and smoothing the
          camera path.
        </li>
        <li>
          <strong>Smart-cut</strong>: transcript, audio energy and motion combined to rank the moments most worth
          keeping.
        </li>
        <li>
          <strong>Background removal and voice isolation</strong>, also on-device.
        </li>
      </ul>
      <Quote cite="From our research notes">Marginal export cost is zero. No watermarks needed on a free tier.</Quote>
      <p>
        That’s the business case in one line. When the editor, the AI and the export all run on your machine, a free
        plan stops being a cost centre — and your footage never has to leave your laptop.
      </p>

      <Callout label="Honest status">
        <p>
          Every experiment builds and runs. But output quality for the WebGPU and AI experiments hasn’t been measured
          yet on real media, and the integration experiment — five workers wired into a mini editor — is still a
          skeleton. Today’s ReelForge renders on the server, with no language-model agent in the loop. This is the road,
          not the destination.
        </p>
      </Callout>
    </>
  );
}
