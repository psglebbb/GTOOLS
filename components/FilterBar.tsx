"use client";

import { useState } from "react";

// Default filter colour map by group
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

interface FilterChip { group: string; value: string; color?: string; }
interface Props {
  activeCategory: string;
  tools: any[];
  news: any[];
}

function getFilters(activeCategory: string, tools: any[], news: any[]): FilterChip[] {
  if (activeCategory === "news") {
    const entry = news[0];
    return entry?.tags ?? [];
  }
  if (activeCategory === "authors") return [];
  const categoryTools = tools.filter((t) => t.category === activeCategory);
  // Collect unique group+value combos
  const seen = new Set<string>();
  const chips: FilterChip[] = [];
  for (const tool of categoryTools) {
    for (const tag of tool.tags ?? []) {
      const key = `${tag.group}:${tag.value}`;
      if (!seen.has(key)) { seen.add(key); chips.push(tag); }
    }
  }
  return chips;
}

export function FilterBar({ activeCategory, tools, news }: Props) {
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);
  const chips = getFilters(activeCategory, tools, news);

  if (!chips.length) return null;

  return (
    <div
      className="hide-scrollbar"
      style={{
        display: "flex",
        gap: 4,
        overflowX: "auto",
        padding: "0 0 2px",
      }}
    >
      {chips.map((chip, i) => {
        const isActive = focusedIdx === null || focusedIdx === i;
        const bg = chip.color ?? GROUP_COLOR[chip.group] ?? "var(--surface)";
        return (
          <div
            key={`${chip.group}-${chip.value}`}
            onClick={() => setFocusedIdx(focusedIdx === i ? null : i)}
            style={{
              flexShrink: 0,
              borderRadius: 2,
              background: bg,
              padding: "3px 10px 3px 6px",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              opacity: isActive ? 1 : 0.35,
              transition: "opacity 180ms linear",
              cursor: "pointer",
            }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 8, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgb(2,2,2)", whiteSpace: "nowrap" }}>
              {chip.group}
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, lineHeight: "14px", letterSpacing: "-0.05em", color: "rgb(2,2,2)", whiteSpace: "nowrap" }}>
              {chip.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
