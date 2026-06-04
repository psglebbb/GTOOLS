import { Tag } from "./Tag";

export function ToolBlock({ entry }: { entry: any }) {
  // Format URL as the big WWW. display
  const displayUrl = formatUrl(entry.url ?? "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-column)" }}>
      {/* Author */}
      <Tag group="Author:" value={entry.author?.name ?? "—"} color="var(--surface)" width="100%" />

      {/* Big red URL display */}
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: 36,
          lineHeight: "36px",
          letterSpacing: "-0.04em",
          color: "var(--tool-link)",
          whiteSpace: "pre-line",
          wordBreak: "break-all",
        }}
      >
        {displayUrl}
      </div>

      {/* Function */}
      {entry.functionValue && (
        <Tag
          group={entry.functionLabel ?? "Function:"}
          value={entry.functionValue}
          color="var(--surface)"
          width="100%"
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

      {/* Tags */}
      {(entry.tags?.length ?? 0) > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {entry.tags.map((tag: any, i: number) => (
            <Tag key={i} group={tag.group} value={tag.value} color={tag.color ?? "var(--surface)"} />
          ))}
        </div>
      )}

      {/* Edited stamp */}
      {entry.editedAt && (
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(195,195,195,0.55)" }}>
          Edited on {formatDate(entry.editedAt)}
        </span>
      )}
    </div>
  );
}

function formatUrl(url: string): string {
  // Strip protocol, split into display lines like the design
  const clean = url.replace(/^https?:\/\//, "");
  const parts = clean.split("/").filter(Boolean);
  return ["WWW.", ...parts.map((p) => p.toUpperCase() + "/")].join("\n");
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
