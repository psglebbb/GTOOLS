import { Tag } from "./Tag";

// Renders one transparent plate per author. Accepts either the new `authors`
// array or a legacy single `author` reference, so existing content keeps working.
export function AuthorPlates({ entry }: { entry: any }) {
  const authors: any[] = entry.authors?.length
    ? entry.authors
    : entry.author
      ? [entry.author]
      : [];
  const list = authors.length ? authors : [{ name: "—" }];
  const label = authors.length > 1 ? "Authors:" : "Author:";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-row)" }}>
      {list.map((a, i) => (
        <Tag
          key={i}
          group={i === 0 ? label : ""}
          value={a?.name ?? "—"}
          color="transparent"
          width="100%"
          multiline
          style={{ color: "var(--plate-quiet)" }}
        />
      ))}
    </div>
  );
}
