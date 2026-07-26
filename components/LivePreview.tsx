"use client";

import { type CSSProperties } from "react";

// A live, embedded 16:9 preview of the tool's own website. The iframe mounts
// directly (no click-to-activate) but uses native lazy-loading, so off-screen
// boxes in the active column don't all fetch at once. Boxes only render in the
// active category column (closed desktop columns show tags, not boxes), so there
// is no iframe fan-out across the whole site.
//
// The iframe is rendered at a "desktop" width and CSS-scaled down, so a narrow
// column shows a shrunken live desktop view. It's kept non-interactive
// (pointer-events: none) so it reads as a live preview and never traps the page
// scroll; the ↗ button opens the real site in a new tab to actually use it.
//
// Note: some sites send X-Frame-Options / CSP frame-ancestors and refuse to be
// framed — those stay blank. Such boxes are better shown as a plain Picture;
// that's an editorial choice in the Studio.
const SCALE = 0.4; // iframe renders at 1/SCALE of the column width (~desktop)

export function LivePreview({
  url,
  posterUrl,
  title,
}: {
  url: string;
  posterUrl?: string | null;
  title?: string;
}) {
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
      {/* Poster (optional) sits underneath and shows while the iframe loads. */}
      {posterUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={posterUrl}
          alt={title ?? "Preview"}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
      )}

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
        } as CSSProperties}
      />

      {/* Open the real site in a new tab — the interactive entry point. */}
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
