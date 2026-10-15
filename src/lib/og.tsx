import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontDir = join(process.cwd(), "assets/fonts");

async function fonts() {
  const [bold, medium, serif, mono] = await Promise.all([
    readFile(join(fontDir, "HankenGrotesk-Bold.woff")),
    readFile(join(fontDir, "HankenGrotesk-Medium.woff")),
    readFile(join(fontDir, "InstrumentSerif-Italic.woff")),
    readFile(join(fontDir, "JetBrainsMono-Medium.woff")),
  ]);
  return [
    { name: "Hanken", data: bold, weight: 700 as const, style: "normal" as const },
    { name: "Hanken", data: medium, weight: 500 as const, style: "normal" as const },
    { name: "Instrument", data: serif, weight: 400 as const, style: "italic" as const },
    { name: "Mono", data: mono, weight: 500 as const, style: "normal" as const },
  ];
}

type Card = {
  kicker: string;
  title: string;
  /** Serif italic line under the title. */
  subtitle?: string;
  footer?: string;
  /** Product colour for the side band; omit for the plain site card. */
  color?: string;
  onColor?: string;
  /** Large label set inside the colour band. */
  bandLabel?: string;
};

export async function renderCard({ kicker, title, subtitle, footer, color, onColor = "#1a1a18", bandLabel }: Card) {
  const titleSize = title.length > 70 ? 58 : title.length > 42 ? 68 : 88;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#faf8f3", fontFamily: "Hanken" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
            padding: "64px 72px",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", fontSize: 40, fontWeight: 700, letterSpacing: -2, color: "#1a1a18" }}>
            vinit churi<span style={{ color: "#c8302a" }}>.</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Mono", fontSize: 22, color: "#5b5953", marginBottom: 20 }}>{kicker}</div>
            <div
              style={{
                fontSize: titleSize,
                fontWeight: 700,
                lineHeight: 1.02,
                letterSpacing: -titleSize * 0.045,
                color: "#1a1a18",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  fontFamily: "Instrument",
                  fontStyle: "italic",
                  fontSize: 36,
                  lineHeight: 1.2,
                  color: "#5b5953",
                  marginTop: 22,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          <div style={{ display: "flex", fontSize: 24, fontWeight: 500, color: "#5b5953" }}>{footer ?? "vinitchuri.me"}</div>
        </div>

        {color && (
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              width: 300,
              background: color,
              color: onColor,
              padding: 40,
            }}
          >
            <div style={{ display: "flex", fontSize: 44, fontWeight: 700, letterSpacing: -2 }}>{bandLabel}</div>
          </div>
        )}
      </div>
    ),
    { ...ogSize, fonts: await fonts() },
  );
}
