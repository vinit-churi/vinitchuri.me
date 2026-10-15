import { Callout, Code, H2, Lede, Steps } from "@/components/prose";
import type { PostMeta } from "./types";

export const meta: PostMeta = {
  slug: "reelforge-one-filter-graph",
  title: "One filter graph: how ReelForge renders captions, B-roll and audio in a single FFmpeg pass",
  dek: "From a canvas preview in the browser to an .ass subtitle file and one filter_complex on the server — the render pipeline behind every ReelForge export.",
  category: "Building",
  product: "reelforge",
  authors: ["kenil-joshi", "vinit-churi"],
  date: "2026-10-14",
  readingMinutes: 10,
};

export default function Post() {
  return (
    <>
      <Lede>
        A ReelForge export has a lot going on: a talking-head clip, captions that fade and slide and bounce, B-roll
        cutting in over specific lines, background music, sound effects, sometimes a watermark. The naive way to render
        that is a chain of passes, each writing an intermediate file. We do it in one.
      </Lede>

      <H2>The unit of editing is three words</H2>
      <p>
        Everything starts with the transcript. Speech-to-text gives us every word with a start and end time, and the
        editor groups them three at a time into caption segments. That number wasn’t arbitrary: three words read punchy
        on a phone screen, and they’re long enough to hang other things on.
      </p>
      <p>
        That’s the trick. When you add B-roll or a sound, you don’t drag it onto a timeline and fiddle with its edges —
        you pin it to one or more caption segments. Its timing comes from the speech, so it lines up by construction.
      </p>

      <H2>Two renderers, one format</H2>
      <p>
        In the browser, captions are previewed on a <code>&lt;canvas&gt;</code> redrawn every animation frame, with
        presets — Classic, Bold, Minimal, Neon — and enter and exit animations. On the server, the final video is
        rendered by FFmpeg with libass. The bridge between them is the ASS subtitle format, which supports positioning,
        fonts, colours and animation tags natively.
      </p>
      <p>Each caption becomes one dialogue line with override tags:</p>
      <Code lang="ass — one generated caption line">{`
Dialogue: 0,0:00:01.20,0:00:02.05,Default,,0,0,0,,{\\pos(960,918)\\fnInter\\fs64\\c&H00FFFFFF&\\fad(300,300)}nobody tells you
`}</Code>
      <Steps
        items={[
          { title: "Fade", body: "\\fad(in, out) — a straight mapping from the editor’s fade durations." },
          { title: "Slide", body: "\\move(x1, y1, x2, y2) between an offset start and the caption’s resting position." },
          { title: "Bounce", body: "\\t(…\\move…) — a timed transform that overshoots and settles." },
          { title: "Colour", body: "The editor’s RGBA becomes ASS &HAABBGGRR — byte order reversed, and alpha inverted, because in ASS 00 is opaque." },
        ]}
      />
      <Callout label="The cost of two renderers">
        <p>
          Canvas2D in the preview and libass in the export can drift — a font metric here, a line break there. ASS gives
          us rich animation for free; the price is keeping two renderers honest. In-browser export (more on that in
          another post) is partly about removing that gap entirely.
        </p>
      </Callout>

      <H2>The filter graph</H2>
      <p>
        The render worker downloads every input, then builds a single <code>filter_complex</code>. In order:
      </p>
      <Code lang="ffmpeg — the shape of the graph">{`
# each B-roll clip: fill the frame, shift to its start, overlay only while it's on
[1:v]scale=W:H:force_original_aspect_ratio=increase,crop=W:H,
     setpts=PTS-STARTPTS+START/TB[b1];
[0:v][b1]overlay=enable='between(t,START,END)'[v1];

# audio layers: normalise, delay to their start, pad, then mix pairwise
[2:a]aformat=…,adelay=…,apad[a1];
[0:a][a1]amix=inputs=2:normalize=0[a];

# free tier: a blurred patch with the watermark on top, bottom-right

# captions last, so nothing ever covers them
[v1]subtitles=filename=captions.ass[out]
`}</Code>
      <p>
        One decode, one encode. With no audio layers, the original audio is stream-copied instead of re-encoded. The
        Docker image refuses to build unless its FFmpeg was compiled with libass — we learned that one the hard way.
      </p>

      <H2>Small details that took a day each</H2>
      <ul>
        <li>
          <strong>Phones lie about orientation.</strong> They record portrait video as landscape with a rotation tag. We
          read both the tag and the side data, and swap width and height before anything else.
        </li>
        <li>
          <strong>Caches are too good.</strong> Re-exporting a project used to return the previous video from the CDN.
          Every export now writes to a unique path.
        </li>
        <li>
          <strong>Failures shouldn’t cost you.</strong> If an upload fails or contains no speech, it doesn’t count
          against your plan’s video allowance.
        </li>
      </ul>

      <H2>Moving the render off the request</H2>
      <p>
        Early on, exports ran inside the API request. In April 2026 they moved to a Celery worker on Redis, with a hard
        time limit, three retries and named progress steps — “Downloading assets”, “Running FFmpeg”, “Uploading
        result” — that the editor polls every few seconds. When it’s done, you get an email with the video. Uploads got
        a safety net too: a project stuck in processing for 15 minutes after a restart is marked failed instead of
        spinning forever.
      </p>
    </>
  );
}
