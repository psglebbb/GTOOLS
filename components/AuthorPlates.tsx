import { CSSProperties } from "react";
import { colorForCategory } from "./gtoolsData";

// One transparent plate listing all authors tightly (like a running list / Fließtext).
// Accepts the new `authors` array or a legacy single `author`. Each name hovers to
// the category colour; if the author has a `url`, the name links (opens new tab).
export function AuthorPlates({ entry }: { entry: any }) {
  const authors: any[] = entry.authors?.length
    ? entry.authors
    : entry.author
      ? [entry.author]
      : [];
  const list = authors.length ? authors : [{ name: "—" }];
  const label = authors.length > 1 ? "Authors:" : "Author:";
  const categoryColor = colorForCategory(entry.category);

  const valueStyle: CSSProperties = {
    fontFamily: "var(--font-display)",
    fontWeight: 700,
    fontSize: 16,
    lineHeight: "17px",
    letterSpacing: "-0.05em",
    overflowWrap: "break-word",
    wordBreak: "break-word",
  };

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "var(--radius-tag)",
        padding: "4px 18px 4px 8px",
        boxSizing: "border-box",
        width: "100%",
        minHeight: 34.2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        ["--author-hover" as any]: categoryColor,
      } as CSSProperties}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 9,
          lineHeight: "10px",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "var(--plate-quiet)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>

      {/* Names as a tight running list — no in-between spacing. */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {list.map((a, i) =>
          a?.url ? (
            <a
              key={i}
              href={a.url}
              target="_blank"
              rel="noopener noreferrer"
              className="author-name"
              style={{ ...valueStyle, textDecoration: "none", cursor: "pointer" }}
            >
              {a?.name ?? "—"}
            </a>
          ) : (
            <span key={i} className="author-name" style={valueStyle}>
              {a?.name ?? "—"}
            </span>
          )
        )}
      </div>
    </div>
  );
}
