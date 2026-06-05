"use client";

import { useEffect, useRef, useState } from "react";
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

// A phone held in landscape: short viewport + landscape orientation. Desktops and
// tablets in landscape are taller than this, so they're unaffected.
function useIsPhoneLandscape() {
  const [v, setV] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-height: 500px) and (orientation: landscape)");
    const update = () => setV(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return v;
}

// Full-screen block shown when a phone is rotated to landscape — keeps the site
// in its intended portrait format instead of flipping to the desktop layout.
function RotateNotice() {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "var(--bg)", color: "var(--ink-on-dark)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 18, padding: 24, textAlign: "center",
      }}
    >
      <div style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 40, lineHeight: "38px", letterSpacing: "-0.04em" }}>
        GTOOLS
      </div>
      <div style={{ fontSize: 28 }}>↻</div>
      <p style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 11, letterSpacing: "0.07em", textTransform: "uppercase", maxWidth: 280, lineHeight: "16px" }}>
        Please rotate your device to portrait
      </p>
    </div>
  );
}

export function GToolsApp({ news, tools }: Props) {
  const [activeCategory, setActiveCategory] = useState("news");
  const [footerMode, setFooterMode] = useState<"closed" | "info">("closed");
  const [lang, setLang] = useState<"EN" | "DE">("EN");
  const [selectedTags, setSelectedTags] = useState<FilterChip[]>([]);
  const isDesktop = useIsDesktop();
  const isPhoneLandscape = useIsPhoneLandscape();

  // Switching big category clears the active filter (one filter context per category).
  useEffect(() => { setSelectedTags([]); }, [activeCategory]);

  // Close the footer Info on any scroll. Capture phase catches both the window
  // scroll (mobile) and the inner-column scroll (desktop).
  useEffect(() => {
    if (footerMode !== "info") return;
    const close = () => setFooterMode("closed");
    window.addEventListener("scroll", close, true);
    return () => window.removeEventListener("scroll", close, true);
  }, [footerMode]);

  const toggleTag = (chip: FilterChip) =>
    setSelectedTags((prev) =>
      prev.some((s) => chipKey(s) === chipKey(chip))
        ? prev.filter((s) => chipKey(s) !== chipKey(chip))
        : [...prev, chip]
    );

  // ── Mobile: horizontal swipe switches category (left → next, right → prev) ──
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    // Only act on a deliberate, mostly-horizontal swipe (don't hijack vertical scroll).
    if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    const idx = CATEGORIES.findIndex((c) => c.id === activeCategory);
    const next = dx < 0 ? idx + 1 : idx - 1;
    if (next < 0 || next >= CATEGORIES.length) return;
    setActiveCategory(CATEGORIES[next].id);
    window.scrollTo({ top: 0 });
  };

  // Phone rotated to landscape → block the horizontal format, ask for portrait.
  if (isPhoneLandscape) {
    return <RotateNotice />;
  }

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
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
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
