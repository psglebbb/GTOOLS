import { Tag } from "./Tag";

export function AuthorList({ authors }: { authors: string[] }) {
  if (!authors.length) {
    return (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(195,195,195,0.45)" }}>
        No authors yet.
      </span>
    );
  }

  // 1:1 with the closed-column author staples (DesktopColumns): a vertical stack
  // of fit-content plates, group "AUTHOR", surface colour, multiline, minHeight 38.
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-row)", alignItems: "flex-start" }}>
      {authors.map((name) => (
        <Tag key={name} group="AUTHOR" value={name} color="var(--surface)" width="fit-content" minHeight={38} multiline />
      ))}
    </div>
  );
}
