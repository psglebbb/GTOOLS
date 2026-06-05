"use client";

import { useRef } from "react";
import { CATEGORIES, categoryTags } from "./gtoolsData";
import { ClosedMenu } from "./ClosedMenu";
import { FilterBar, type FilterChip } from "./FilterBar";
import { CategoryBody } from "./CategoryBody";
import { Tag } from "./Tag";
import { Footer } from "./Footer";
import { colorForTag } from "./tagColors";

const COL = "var(--col-desktop)";

interface Props {
  news: any[];
  tools: any[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  selectedTags: FilterChip[];
  onToggleTag: (chip: FilterChip) => void;
  footerMode: "closed" | "info";
  lang: "EN" | "DE";
  onFooterTab: (m: "closed" | "info") => void;
  onLangChange: (l: "EN" | "DE") => void;
}

export function DesktopColumns({
  news, tools, activeCategory, onSelectCategory, selectedTags, onToggleTag,
  footerMode, lang, onFooterTab, onLangChange,
}: Props) {
  const stripRef = useRef<HTMLDivElement>(null);

  // Activate a category: make it the viewing column + scroll the strip home.
  function activate(catId: string) {
    onSelectCategory(catId);
    stripRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }

  function handleScroll() {
    if (footerMode === "info") onFooterTab("closed");
  }

  const closedCats = CATEGORIES.filter((c) => c.id !== activeCategory);

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg)", overflow: "hidden" }}>
      {/* Fixed GTOOLS wordmark — hovers above the leftmost (viewing) column */}
      <div style={{ position: "fixed", left: 2, top: 0, width: COL, zIndex: 30, pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "var(--t-logo-desktop)", lineHeight: "72px",
            letterSpacing: "var(--tr-display)", color: "var(--ink-on-dark)",
            textAlign: "center", padding: "0 0 8px", background: "var(--bg)",
          }}
        >
          GTOOLS
        </div>
      </div>

      {/* Horizontal strip of columns */}
      <div
        ref={stripRef}
        onScroll={handleScroll}
        style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "stretch",
          overflowX: "auto", overflowY: "hidden",
        }}
      >
        {/* Viewing (live) column */}
        <div
          className="hide-scrollbar"
          style={{
            flex: `0 0 ${COL}`, width: COL, minHeight: "100%",
            padding: "80px 0 110px", boxSizing: "border-box",
            display: "flex", flexDirection: "column", gap: "var(--gap-block)",
            overflowY: "auto",
          }}
        >
          <div style={{ position: "sticky", top: 0, zIndex: 4, background: "var(--bg)", paddingBottom: "var(--gap-block)", display: "flex", flexDirection: "column", gap: "var(--gap-block)" }}>
            <ClosedMenu categories={CATEGORIES} activeId={activeCategory} onSelect={onSelectCategory} rowH={38} overlap={30} />
            <FilterBar activeCategory={activeCategory} tools={tools} news={news} selected={selectedTags} onToggle={onToggleTag} />
          </div>
          <CategoryBody activeCategory={activeCategory} news={news} tools={tools} selectedTags={selectedTags} />
        </div>

        {/* Closed columns — header + stapled real tags for the category */}
        {closedCats.map((cat) => {
          const tags = categoryTags(cat.id, tools, news);
          return (
            <div
              key={cat.id}
              className="hide-scrollbar"
              onClick={() => activate(cat.id)}
              style={{
                flex: `0 0 ${COL}`, width: COL, minHeight: "100%",
                padding: "80px 0 110px", boxSizing: "border-box",
                display: "flex", flexDirection: "column", gap: "var(--gap-block)",
                overflowY: "auto", cursor: "pointer",
                borderLeft: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <Tag group="Category" value={cat.label} color={cat.color} outline={cat.outline} width="100%" minHeight={38} />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-row)", alignItems: "flex-start" }}>
                {tags.map((t, i) => (
                  <Tag key={i} group={t.group} value={t.value} color={colorForTag(t.value, t.color)} width="fit-content" minHeight={38} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Fixed footer — bottom-left under the viewing column */}
      <div style={{ position: "fixed", left: 2, bottom: 2, width: COL, zIndex: 10 }}>
        <Footer mode={footerMode} lang={lang} onTabChange={onFooterTab} onLangChange={onLangChange} />
      </div>
    </div>
  );
}
