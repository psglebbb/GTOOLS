import { CSSProperties } from "react";
import { Tag } from "./Tag";
import { AuthorPlates } from "./AuthorPlates";
import { colorForTag } from "./tagColors";
import { colorForCategory } from "./gtoolsData";

export function ToolBlock({ entry }: { entry: any }) {
  // Format URL as the big WWW. display
  const displayUrl = formatUrl(entry.url ?? "");
  const categoryColor = colorForCategory(entry.category);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-section)" }}>
      {/* Edited stamp — always before the tool */}
      {entry.editedAt && (
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(195,195,195,0.55)" }}>
          Edited on {formatDate(entry.editedAt)}
        </span>
      )}

      {/* Author(s) — one transparent plate per author */}
      <AuthorPlates entry={entry} />

      {/* Big WWW. URL display — link; light grey, shifts to the category colour on
          hover, opens in a new tab. */}
      <a
        href={entry.url}
        target="_blank"
        rel="noopener noreferrer"
        className="tool-www"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: 54,
          lineHeight: "50px",
          letterSpacing: "-0.04em",
          textAlign: "center",
          textTransform: "uppercase",
          whiteSpace: "pre-line",
          wordBreak: "break-word",
          padding: "8px 8px",
          display: "block",
          textDecoration: "none",
          cursor: "pointer",
          ["--tool-www-hover" as any]: categoryColor,
        } as CSSProperties}
      >
        {displayUrl}
      </a>

      {/* Function — transparent plate, quiet grey type */}
      {entry.functionValue && (
        <Tag
          group={entry.functionLabel ?? "Function:"}
          value={entry.functionValue}
          color="transparent"
          width="100%"
          multiline
          style={{ color: "var(--plate-quiet)" }}
        />
      )}

      {/* Body copy */}
      {entry.description && (
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: 13, lineHeight: "15px", letterSpacing: "-0.04em",
          color: "var(--ink-on-dark)",
        }}>
          {entry.description}
        </p>
      )}

      {/* Tags — keep their group colours */}
      {(entry.tags?.length ?? 0) > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--gap-row)", marginTop: "var(--gap-divide)" }}>
          {entry.tags.map((tag: any, i: number) => (
            <Tag key={i} group={tag.group} value={tag.value} color={colorForTag(tag.value, tag.color)} valueCase={tag.group === "AUTHOR" ? undefined : "title"} />
          ))}
        </div>
      )}
    </div>
  );
}

function formatUrl(url: string): string {
  // Split into display lines like the design:
  //   line 1: WWW.
  //   line 2: the domain name WITH its trailing dot (e.g. INKSCAPE.)
  //   line 3: the domain extension letters (e.g. ORG/)
  //   line 4+: any path segments
  const clean = url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
  const [host = "", ...pathParts] = clean.split("/").filter(Boolean);
  const lastDot = host.lastIndexOf(".");
  const name = lastDot > 0 ? host.slice(0, lastDot + 1) : host; // keep the dot on line 2
  const ext = lastDot > 0 ? host.slice(lastDot + 1) : "";

  const lines = ["WWW.", name, ext + "/"];
  for (const p of pathParts) lines.push(p + "/");
  return lines.join("\n");
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
