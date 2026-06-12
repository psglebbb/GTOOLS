import { CSSProperties } from "react";
import type { AuthorLink } from "./gtoolsData";

// The All-Authors view: a curated running list of just the author names. If an
// author has a `url`, the name becomes a link (opens the portfolio in a new tab);
// no underline — interactivity is hinted by the hover colour only.
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        ["--author-hover" as any]: "#FF0000",
      } as CSSProperties}
    >
      {authors.map((a) =>
        a.url ? (
          <a
            key={a.name}
            href={a.url}
            target="_blank"
            rel="noopener noreferrer"
            className="author-name"
            style={{ ...nameStyle, textDecoration: "none", cursor: "pointer" }}
          >
            {a.name}
          </a>
        ) : (
          <span key={a.name} className="author-name" style={nameStyle}>
            {a.name}
          </span>
        )
      )}
    </div>
  );
}
