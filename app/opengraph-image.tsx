import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ctrl-c-ctrl-v — Real-time Code Sharing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0f",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="#6366f1">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span style={{ color: "#ffffff", fontSize: 36, fontWeight: 600, letterSpacing: "-1px" }}>
            ctrl-c-ctrl-v
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: "#ffffff",
            fontSize: 72,
            fontWeight: 800,
            textAlign: "center",
            lineHeight: 1.1,
            letterSpacing: "-2px",
            marginBottom: 24,
          }}
        >
          Share code.{" "}
          <span style={{ color: "#6366f1" }}>Instantly.</span>
        </div>

        {/* Subtext */}
        <div style={{ color: "#64748b", fontSize: 28, textAlign: "center", maxWidth: 700 }}>
          No sign up. No accounts. Just a room code.
        </div>

        {/* URL badge */}
        <div
          style={{
            marginTop: 48,
            background: "#111118",
            border: "1px solid #2d2d3d",
            borderRadius: 12,
            padding: "12px 28px",
            color: "#6366f1",
            fontSize: 22,
            fontFamily: "monospace",
          }}
        >
          ctrl-c-ctrl-v.up.railway.app
        </div>
      </div>
    ),
    { ...size }
  );
}
