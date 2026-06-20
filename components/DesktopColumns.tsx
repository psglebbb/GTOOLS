"use client";

import { useRef } from "react";
import { categoryTags, type Category } from "./gtoolsData";
import { ClosedMenu } from "./ClosedMenu";
import { FilterBar, type FilterChip } from "./FilterBar";
import { CategoryBody } from "./CategoryBody";
import { Tag } from "./Tag";
import { Footer } from "./Footer";
import { colorForTagInGroup } from "./tagColors";

const COL = "var(--col-desktop)";

interface Props {
  news: any[];
  tools: any[];
  categories: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  onSelectCategoryWithTag: (id: string, chip: FilterChip) => void;
  selectedTags: FilterChip[];
  onToggleTag: (chip: FilterChip) => void;
  footerMode: "closed" | "info";
  lang: "EN" | "DE";
  onFooterTab: (m: "closed" | "info") => void;
  onLangChange: (l: "EN" | "DE") => void;
}

export function DesktopColumns({
  news, tools, categories, activeCategory, onSelectCategory, onSelectCategoryWithTag, selectedTags, onToggleTag,
  footerMode, lang, onFooterTab, onLangChange,
}: Props) {
  const stripRef = useRef<HTMLDivElement>(null);

  // Activate a category: make it the viewing column + scroll the strip home.
  function activate(catId: string) {
    onSelectCategory(catId);
    stripRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }

  // Open a category via one of its tags: preselect that tag in the filter bar.
  function activateWithTag(catId: string, chip: FilterChip) {
    onSelectCategoryWithTag(catId, chip);
    stripRef.current?.scrollTo({ left: 0, behavior: "smooth" });
  }

  function handleScroll() {
    if (footerMode === "info") onFooterTab("closed");
  }

  const closedCats = categories.filter((c) => c.id !== activeCategory);

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--bg)", overflow: "hidden" }}>
      {/* GTOOLS wordmark — full-width black masthead. Not fixed: it sits at the
          top of the (fixed) shell and the columns scroll vertically *under* it,
          so it reads like a top border that masks everything beneath. */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", background: "var(--bg)", zIndex: 30, pointerEvents: "none" }}>
        <div
          style={{
            width: COL, marginLeft: 2,
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "var(--t-logo-desktop)", lineHeight: "72px",
            letterSpacing: "var(--tr-display)", color: "var(--tool-link)",
            textAlign: "center", padding: "0 0 8px",
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
          onScroll={handleScroll}
          style={{
            flex: `0 0 ${COL}`, width: COL, minWidth: 0, maxWidth: COL, minHeight: "100%",
            padding: "80px 0 110px", boxSizing: "border-box",
            display: "flex", flexDirection: "column", gap: "var(--gap-block)",
            overflowY: "auto",
          }}
        >
          <div style={{ position: "sticky", top: 0, zIndex: 4, background: "var(--bg)", paddingBottom: "var(--gap-block)", display: "flex", flexDirection: "column", gap: "var(--gap-block)" }}>
            <ClosedMenu categories={categories} activeId={activeCategory} onSelect={onSelectCategory} rowH={38} overlap={30} />
            <FilterBar activeCategory={activeCategory} tools={tools} news={news} selected={selectedTags} onToggle={onToggleTag} />
          </div>
          <CategoryBody activeCategory={activeCategory} news={news} tools={tools} selectedTags={selectedTags} onToggleTag={onToggleTag} />
        </div>

        {/* Closed columns — header + stapled real tags for the category */}
        {closedCats.map((cat) => {
          const tags = categoryTags(cat.id, tools, news);
          return (
            <div
              key={cat.id}
              className="hide-scrollbar"
              onClick={() => activate(cat.id)}
              onScroll={handleScroll}
              style={{
                flex: `0 0 ${COL}`, width: COL, minWidth: 0, maxWidth: COL, minHeight: "100%",
                padding: "80px 0 110px", boxSizing: "border-box",
                display: "flex", flexDirection: "column", gap: "var(--gap-block)",
                overflowY: "auto", cursor: "pointer",
                borderLeft: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <Tag group="Category" value={cat.label} color={cat.color} outline={cat.outline} width="100%" minHeight={38} valueCase="upper" />
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-row)", alignItems: "flex-start" }}>
                {tags.map((t, i) => (
                  <div
                    key={i}
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.stopPropagation(); // don't also trigger the column's plain activate
                      // Author staples just open the All-Authors view (no tag filter there).
                      if (cat.id === "authors") { activate(cat.id); return; }
                      activateWithTag(cat.id, { group: t.group, value: t.value, color: t.color });
                    }}
                  >
                    <Tag group={t.group} value={t.value} color={colorForTagInGroup(t.group, t.value, t.color)} width="fit-content" minHeight={38} multiline valueCase={t.group === "AUTHOR" || t.group === "EVENT" ? undefined : "title"} />
                  </div>
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
