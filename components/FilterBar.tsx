"use client";

import { Tag } from "./Tag";
import { colorForTag } from "./tagColors";

// Default filter colour map by group (fallback when an entry tag has no colour)
const GROUP_COLOR: Record<string, string> = {
  ACCESS:   "var(--tag-access-base)",
  LICENSE:  "var(--tag-license-base)",
  EXPORT:   "var(--tag-export-3)",
  PLATFORM: "var(--tag-platform-base)",
  TYPO:     "var(--tag-typo-base)",
  ROOTS:    "var(--tag-roots-base)",
  BROWSER:  "var(--tag-browser-base)",
  EVENT:    "var(--tag-access-base)",
  AUTHOR:   "var(--surface)",
};

export interface FilterChip { group: string; value: string; color?: string; }
interface Props {
  activeCategory: string;
  tools: any[];
  news: any[];
  selected: FilterChip[];
  onToggle: (chip: FilterChip) => void;
}

// Reality-driven: the filter bar shows only the tags actually present on the
// entries currently published in the active category (de-duped, first-seen order).
function getFilters(activeCategory: string, tools: any[], news: any[]): FilterChip[] {
  let source: any[] = [];
  if (activeCategory === "news") source = news;
  else if (activeCategory === "authors") return [];
  else source = tools.filter((t) => t.category === activeCategory);

  const seen = new Set<string>();
  const chips: FilterChip[] = [];
  for (const entry of source) {
    for (const tag of entry.tags ?? []) {
      const key = `${tag.group}:${tag.value}`;
      if (!seen.has(key)) { seen.add(key); chips.push(tag); }
    }
  }
  return chips;
}

export const chipKey = (c: FilterChip) => `${c.group}|${c.value}`;

export function FilterBar({ activeCategory, tools, news, selected, onToggle }: Props) {
  const chips = getFilters(activeCategory, tools, news);
  if (!chips.length) return null;

  const isSelected = (c: FilterChip) => selected.some((s) => chipKey(s) === chipKey(c));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {/* Horizontal-scroll chip strip */}
      <div
        className="hide-scrollbar"
        style={{ display: "flex", gap: 2, overflowX: "auto", alignItems: "center" }}
      >
        {chips.map((chip) => {
          const sel = isSelected(chip);
          const bg = colorForTag(chip.value, chip.color ?? GROUP_COLOR[chip.group]);
          return (
            <div
              key={chipKey(chip)}
              onClick={() => onToggle(chip)}
              style={{
                flexShrink: 0,
                opacity: sel ? 0.35 : 1,
                transition: "opacity 120ms linear",
                cursor: "pointer",
              }}
            >
              <Tag group={chip.group} value={chip.value} color={bg} />
            </div>
          );
        })}
      </div>

      {/* Selected staple — red plate, white type, left-aligned, ragged right */}
      {selected.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "flex-start" }}>
          {selected.map((chip) => (
            <Tag
              key={chipKey(chip)}
              group={chip.group}
              value={chip.value}
              color="#FF0000"
              width="fit-content"
              style={{ color: "#FFFFFF" }}
              onClick={() => onToggle(chip)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
