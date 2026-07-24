"use client";

import { useState, type CSSProperties } from "react";

// A live, embedded 16:9 preview of the tool's own website. Click-to-activate so
// the iframe only mounts on demand (and only ever in the active category column,
// where boxes render at all) — 40 live iframes at once would be far too heavy.
//
// The iframe is rendered at a "desktop" width and CSS-scaled down, so a narrow
// column shows a shrunken live desktop view. It's kept non-interactive
// (pointer-events: none) so it reads as a live preview and never traps the page
// scroll; the ↗ button opens the real site in a new tab to actually use it.
//
// Note: some sites send X-Frame-Options / CSP frame-ancestors and refuse to be
// framed — those stay blank after activation. Such boxes are better shown as a
// plain Picture; that's an editorial choice in the Studio.
const SCALE = 0.4; // iframe renders at 1/SCALE of the column width (~desktop)

export function LivePreview({
  url,
  posterUrl,
  title,
  displayUrl,
  accent,
}: {
  url: string;
  posterUrl?: string | null;
  title?: string;
  displayUrl: string;
  accent: string;
}) {
  const [live, setLive] = useState(false);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: "var(--radius-tag)",
        overflow: "hidden",
        background: "#0A0A0A",
        lineHeight: 0,
      }}
    >
      {live ? (
        <iframe
          src={url}
          title={title ?? "Live preview"}
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          referrerPolicy="no-referrer"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: `${100 / SCALE}%`,
            height: `${100 / SCALE}%`,
            border: 0,
            transform: `scale(${SCALE})`,
            transformOrigin: "top left",
            pointerEvents: "none", // live but non-interactive → no scroll trap
          }}
        />
      ) : posterUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterUrl}
          alt={title ?? "Preview"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : null}

      {/* Activate overlay — poster/URL + a ▶ affordance. Click starts the embed. */}
      {!live && (
        <button
          onClick={(e) => { e.stopPropagation(); setLive(true); }}
          aria-label="Start live preview"
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            border: 0,
            cursor: "pointer",
            background: posterUrl ? "rgba(0,0,0,0.28)" : "transparent",
            color: "#FFFFFF",
            fontFamily: "var(--font-mono)",
            fontWeight: 700,
            fontSize: 9,
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            lineHeight: "12px",
            padding: 8,
            textAlign: "center",
          } as CSSProperties}
        >
          <span style={{ fontSize: 18, lineHeight: "18px", color: accent }}>▶</span>
          <span>Live preview</span>
          {!posterUrl && (
            <span style={{ opacity: 0.6, whiteSpace: "pre-line" }}>{displayUrl}</span>
          )}
        </button>
      )}

      {/* Open the real site in a new tab — always available. */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title="Open in new tab"
        style={{
          position: "absolute",
          top: 6,
          right: 6,
          zIndex: 2,
          width: 22,
          height: 22,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 6,
          background: "rgba(0,0,0,0.55)",
          color: "#FFFFFF",
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          lineHeight: "12px",
          textDecoration: "none",
        }}
      >
        ↗
      </a>
    </div>
  );
}
