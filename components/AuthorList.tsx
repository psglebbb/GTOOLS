import { CSSProperties } from "react";
import type { AuthorLink } from "./gtoolsData";

// Vibrant hover palette. Each author gets one, picked by a stable hash of the
// name — looks random across the list but never flickers / mismatches on hydrate.
const HOVER_COLORS = [
  "#FFEA00", "#0DFF00", "#FF35FF", "#35A1FF", "#FF3535",
  "#E0FFA3", "#e077c2", "#FFA500", "#00FFD0", "#FF7AD9",
];
function hoverColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return HOVER_COLORS[h % HOVER_COLORS.length];
}

// The All-Authors view: a curated running list of just the author names. If an
// author has a `url`, the name becomes a link (opens the portfolio in a new tab);
// no underline — interactivity is hinted by the hover colour only. Each name
// hovers to its own (hash-picked) colour.
export function AuthorList({ authors }: { authors: AuthorLink[] }) {
  if (!authors.length) {
    return (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(195,195,195,0.45)" }}>
        No authors yet.
      </span>
    );
  }

  const nameStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 16,
    lineHeight: "18px",
    letterSpacing: "-0.05em",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {authors.map((a) => {
        const style = { ...nameStyle, ["--author-hover" as any]: hoverColor(a.name) } as CSSProperties;
        return a.url ? (
          <a
            key={a.name}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="author-name"
            style={{ ...style, textDecoration: "none", cursor: "pointer" }}
          >
            {a.name}
          </a>
        ) : (
          <span key={a.name} className="author-name" style={style}>
            {a.name}
          </span>
        );
      })}
    </div>
  );
}
