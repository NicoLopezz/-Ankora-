import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "Ankora — Anchored to real assets";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const iconSvg = await readFile(join(process.cwd(), "src/app/icon.svg"), "utf-8");
  const iconData = `data:image/svg+xml;utf8,${encodeURIComponent(iconSvg)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#3a1410",
          backgroundImage:
            "radial-gradient(ellipse at 50% 35%, rgba(212,164,90,0.22) 0%, transparent 55%), radial-gradient(ellipse at 50% 90%, rgba(94,11,21,0.6) 0%, transparent 60%)",
          color: "#ddcfc9",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconData}
          width={200}
          height={192}
          alt=""
          style={{ filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.45))" }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 56,
            gap: 18,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 300,
              letterSpacing: "-0.04em",
              color: "#ddcfc9",
            }}
          >
            Ankora
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 400,
              letterSpacing: "0.01em",
              color: "#D4A45A",
              fontStyle: "italic",
            }}
          >
            Anchored to real assets
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 48,
            fontSize: 20,
            color: "rgba(221,207,201,0.55)",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          Tokenized real-world assets · Regulated marketplace
        </div>
      </div>
    ),
    size,
  );
}
