import { Tag } from "./Tag";

export function AuthorList({ authors }: { authors: string[] }) {
  if (!authors.length) {
    return (
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(195,195,195,0.45)" }}>
        No authors yet.
      </span>
    );
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--gap-row)" }}>
      {authors.map((name) => (
        <Tag key={name} group="Author" value={name} color="var(--surface)" />
      ))}
    </div>
  );
}
