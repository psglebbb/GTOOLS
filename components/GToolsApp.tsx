"use client";

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ClosedMenu } from "./ClosedMenu";
import { FilterBar } from "./FilterBar";
import { CategoryBody } from "./CategoryBody";
import { Footer } from "./Footer";
import { DesktopColumns } from "./DesktopColumns";
import { CATEGORIES } from "./gtoolsData";
import { chipKey, type FilterChip } from "./FilterBar";

interface Props {
  news: any[];
  tools: any[];
}

// Switches to the desktop horizontal-column layout at >= 700px.
function useIsDesktop() {
  // Default false so SSR + first client render agree (mobile-first, no hydration mismatch).
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 700px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

export function GToolsApp({ news, tools }: Props) {
  const [activeCategory, setActiveCategory] = useState("news");
  const [footerMode, setFooterMode] = useState<"closed" | "info">("closed");
  const [lang, setLang] = useState<"EN" | "DE">("EN");
  const [selectedTags, setSelectedTags] = useState<FilterChip[]>([]);
  const isDesktop = useIsDesktop();

  // Switching big category clears the active filter (one filter context per category).
  useEffect(() => { setSelectedTags([]); }, [activeCategory]);

  const toggleTag = (chip: FilterChip) =>
    setSelectedTags((prev) =>
      prev.some((s) => chipKey(s) === chipKey(chip))
        ? prev.filter((s) => chipKey(s) !== chipKey(chip))
        : [...prev, chip]
    );

  if (isDesktop) {
    return (
      <DesktopColumns
        news={news}
        tools={tools}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        selectedTags={selectedTags}
        onToggleTag={toggleTag}
        footerMode={footerMode}
        lang={lang}
        onFooterTab={setFooterMode}
        onLangChange={setLang}
      />
    );
  }

  // ── Mobile: single fixed-width viewing column ──
  return (
    <div
      style={{
        minHeight: "100svh",
        background: "var(--bg)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingBottom: 90,
      }}
    >
      {/* Sticky top chrome */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "var(--bg)",
          width: "min(var(--col-width), 100vw)",
          padding: "0 6px",
          paddingTop: 5,
          display: "flex",
          flexDirection: "column",
          gap: "var(--gap-column)",
        }}
      >
        <Logo />
        <ClosedMenu
          categories={CATEGORIES}
          activeId={activeCategory}
          onSelect={setActiveCategory}
        />
        <FilterBar
          activeCategory={activeCategory}
          tools={tools}
          news={news}
          selected={selectedTags}
          onToggle={toggleTag}
        />
      </div>

      {/* Scrollable body */}
      <div
        style={{
          flex: 1,
          width: "min(var(--col-width), 100vw)",
          padding: "var(--gap-column) 6px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "var(--gap-column)",
        }}
        onScroll={() => {
          if (footerMode === "info") setFooterMode("closed");
        }}
      >
        <CategoryBody activeCategory={activeCategory} news={news} tools={tools} selectedTags={selectedTags} />
      </div>

      {/* Fixed footer */}
      <div
        style={{
          position: "fixed",
          bottom: 6,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(calc(var(--col-width) - 12px), calc(100vw - 12px))",
          zIndex: 20,
        }}
      >
        <Footer
          mode={footerMode}
          lang={lang}
          onTabChange={setFooterMode}
          onLangChange={setLang}
        />
      </div>
    </div>
  );
}
