"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import { ClosedMenu } from "./ClosedMenu";
import { FilterBar } from "./FilterBar";
import { NewsBlock } from "./NewsBlock";
import { ToolBlock } from "./ToolBlock";
import { AuthorList } from "./AuthorList";
import { Footer } from "./Footer";

const CATEGORIES = [
  { id: "news",    label: "NEWS",                color: "var(--cat-news)" },
  { id: "alt",     label: "Alternative Software", color: "var(--cat-alt-software)" },
  { id: "fonts",   label: "FONTS",               color: "var(--cat-fonts)" },
  { id: "small",   label: "SMALL-TECH",          color: "var(--cat-small-tech)" },
  { id: "big",     label: "BIG-TECH",            color: "var(--cat-big-tech)" },
  { id: "web",     label: "WEB",                 color: "var(--cat-web)" },
  { id: "authors", label: "ALL AUTHORS",         color: "transparent", outline: true },
];

interface Props {
  news: any[];
  tools: any[];
}

export function GToolsApp({ news, tools }: Props) {
  const [activeCategory, setActiveCategory] = useState("news");
  const [footerMode, setFooterMode] = useState<"closed" | "info">("closed");
  const [lang, setLang] = useState<"EN" | "DE">("EN");

  const newsEntry = news[0] ?? null;
  const toolsForCategory = (catId: string) =>
    tools.filter((t) => t.category === catId);

  const allAuthors = Array.from(
    new Set(tools.map((t) => t.author?.name).filter(Boolean))
  );

  function renderBody() {
    if (activeCategory === "news") {
      return newsEntry ? <NewsBlock entry={newsEntry} /> : <EmptyState label="No news yet." />;
    }
    if (activeCategory === "authors") {
      return <AuthorList authors={allAuthors} />;
    }
    const categoryTools = toolsForCategory(activeCategory);
    if (!categoryTools.length) return <EmptyState label="No entries yet." />;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-column)" }}>
        {categoryTools.map((tool) => (
          <ToolBlock key={tool._id} entry={tool} />
        ))}
      </div>
    );
  }

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

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
          paddingTop: 12,
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
        <FilterBar activeCategory={activeCategory} tools={tools} news={news} />
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
        {renderBody()}
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
