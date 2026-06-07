import { Box } from "./Box";
import { AuthorList } from "./AuthorList";
import { authorsList } from "./gtoolsData";
import type { FilterChip } from "./FilterBar";

interface Props {
  activeCategory: string;
  news: any[];
  tools: any[];
  selectedTags?: FilterChip[];
  onToggleTag?: (chip: FilterChip) => void;
}

// True when an entry carries every selected tag (AND — each filter narrows further).
function matchesAllTags(entry: any, selected: FilterChip[]): boolean {
  const entryTags = entry.tags ?? [];
  return selected.every((sel) =>
    entryTags.some((t: any) => t.group === sel.group && t.value === sel.value)
  );
}

// The live block for a category — shared between the mobile single column and
// the desktop viewing column. Every big category (including News) is a filtered
// list of unified boxes; Authors is the one special view.
export function CategoryBody({ activeCategory, news, tools, selectedTags = [], onToggleTag }: Props) {
  if (activeCategory === "authors") {
    return <AuthorList authors={authorsList(tools, news)} />;
  }

  const categoryBoxes = tools.filter((t) => t.category === activeCategory);
  const visible = selectedTags.length
    ? categoryBoxes.filter((t) => matchesAllTags(t, selectedTags))
    : categoryBoxes;

  if (!categoryBoxes.length) return <EmptyState label="No entries yet." />;
  if (!visible.length) return <EmptyState label="Nothing matches this filter." />;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-tools)" }}>
      {visible.map((entry) => (
        <Box key={entry._id} entry={entry} selectedTags={selectedTags} onToggleTag={onToggleTag} />
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
