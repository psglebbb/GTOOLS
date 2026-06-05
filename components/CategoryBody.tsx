import { NewsBlock } from "./NewsBlock";
import { ToolBlock } from "./ToolBlock";
import { AuthorList } from "./AuthorList";
import { authorsList } from "./gtoolsData";
import type { FilterChip } from "./FilterBar";

interface Props {
  activeCategory: string;
  news: any[];
  tools: any[];
  selectedTags?: FilterChip[];
}

// True when an entry carries every selected tag (AND — each filter narrows further).
function matchesAllTags(entry: any, selected: FilterChip[]): boolean {
  const entryTags = entry.tags ?? [];
  return selected.every((sel) =>
    entryTags.some((t: any) => t.group === sel.group && t.value === sel.value)
  );
}

// The live block for a category — shared between the mobile single column and
// the desktop viewing column.
export function CategoryBody({ activeCategory, news, tools, selectedTags = [] }: Props) {
  if (activeCategory === "news") {
    const entry = news[0] ?? null;
    return entry ? <NewsBlock entry={entry} /> : <EmptyState label="No news yet." />;
  }

  if (activeCategory === "authors") {
    return <AuthorList authors={authorsList(tools, news)} />;
  }

  const categoryTools = tools.filter((t) => t.category === activeCategory);
  const visibleTools = selectedTags.length
    ? categoryTools.filter((t) => matchesAllTags(t, selectedTags))
    : categoryTools;

  if (!categoryTools.length) return <EmptyState label="No entries yet." />;
  if (!visibleTools.length) return <EmptyState label="No tools match this filter." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-tools)" }}>
      {visibleTools.map((tool) => (
        <ToolBlock key={tool._id} entry={tool} />
      ))}
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: 9,
        letterSpacing: "0.07em",
        textTransform: "uppercase",
        color: "rgba(195,195,195,0.45)",
        padding: "24px 0",
      }}
    >
      {label}
    </div>
  );
}
