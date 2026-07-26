"use client";

import { type CSSProperties } from "react";

// A live, embedded 16:9 preview of the tool's own website with the big WWW-URL
// title layer permanently overlaid in difference blend — the same treatment as
// the custom "Picture + Title" boxes. The site preview underneath is dimmed to
// ~50% so the title always reads. The title is the click target (opens the real
// site in a new tab); the iframe itself is non-interactive so it never traps
// page scroll.
//
// The iframe mounts directly (native lazy-loading keeps off-screen boxes in the
// active column from all fetching at once) and is rendered at a "desktop" width
// then CSS-scaled into the 16:9 frame, so a narrow column shows a shrunken live
// desktop view. Boxes only render in the active category column, so there is no
// iframe fan-out across the site.
//
// Note: some sites send X-Frame-Options / CSP frame-ancestors and refuse to be
// framed — those stay blank behind the title. Such boxes are better shown as a
// plain Picture; that's an editorial choice in the Studio.
const SCALE = 0.4; // iframe renders at 1/SCALE of the column width (~desktop)
const PREVIEW_OPACITY = 0.5; // dim the live site so the title reads over it

export function LivePreview({
  url,
  linkUrl,
  displayUrl,
  posterUrl,
  title,
}: {
  url: string;
  linkUrl?: string;
  displayUrl: string;
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
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: PREVIEW_OPACITY }}
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
          opacity: PREVIEW_OPACITY,
          pointerEvents: "none", // live but non-interactive → no scroll trap
        } as CSSProperties}
      />

      {/* Big WWW-URL title, permanently overlaid in difference blend — same logic
          as the Picture + Title boxes. Clicking it opens the real site. */}
      <a
        href={linkUrl ?? url}
        target="_blank"
        rel="noopener noreferrer"
        className="tool-www"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          letterSpacing: "-0.04em",
          textAlign: "center",
          textTransform: "uppercase",
          whiteSpace: "pre-line",
          wordBreak: "break-word",
          padding: "8px",
          color: "#FFFFFF",
          mixBlendMode: "difference",
          textDecoration: "none",
        } as CSSProperties}
      >
        {displayUrl}
      </a>
    </div>
  );
}
