// Shared category definitions + derived data for the GTOOLS layout.
// Used by both the mobile (single column) and desktop (horizontal column strip) views.

export interface Category {
  id: string;
  label: string;
  color: string;
  outline?: boolean;
}

// The 7 big categories. `news` → news block; `authors` → author list;
// every other id → tool block, filtered by `tool.category`.
export const CATEGORIES: Category[] = [
  { id: "news",    label: "NEWS",                 color: "var(--cat-news)" },
  { id: "alt",     label: "Alternative Software", color: "var(--cat-alt-software)" },
  { id: "fonts",   label: "FONTS",                color: "var(--cat-fonts)" },
  { id: "small",   label: "SMALL-TECH",           color: "var(--cat-small-tech)" },
  { id: "big",     label: "BIG-TECH",             color: "var(--cat-big-tech)" },
  { id: "web",     label: "WEB",                  color: "var(--cat-web)" },
  { id: "authors", label: "ALL AUTHORS",          color: "transparent", outline: true },
];

// The display colour of a big category, by id (used e.g. for the tool-link hover).
export function colorForCategory(catId: string): string {
  return CATEGORIES.find((c) => c.id === catId)?.color ?? "var(--tool-link)";
}

export interface TagLike { group: string; value: string; color?: string; }

// The entries currently published for a given category. Every category (News
// included) is a slice of the unified `tools` boxes; Authors has its own view.
export function entriesForCategory(catId: string, tools: any[], _news: any[]): any[] {
  if (catId === "authors") return [];
  return tools.filter((t) => t.category === catId);
}

// Reality-driven tag list for a category: the union of the tags actually present
// on that category's entries (de-duped, first-seen order). Drives both the
// filter bar and the stapled closed-column staple on desktop.
export function categoryTags(catId: string, tools: any[], news: any[]): TagLike[] {
  if (catId === "authors") {
    return authorsList(tools, news).map(({ name }) => ({
      group: "AUTHOR",
      value: name,
      color: "var(--surface)",
    }));
  }
  const seen = new Set<string>();
  const out: TagLike[] = [];
  for (const entry of entriesForCategory(catId, tools, news)) {
    for (const tag of entry.tags ?? []) {
      const key = `${tag.group}:${tag.value}`;
      if (!seen.has(key)) { seen.add(key); out.push(tag); }
    }
  }
  return out;
}

export interface AuthorLink { name: string; url?: string; }

// All distinct authors across tools + news, in first-seen order. Each carries its
// optional `url` so the All-Authors view can render the name as an external link.
export function authorsList(tools: any[], news: any[]): AuthorLink[] {
  const seen = new Set<string>();
  const out: AuthorLink[] = [];
  for (const entry of [...tools, ...news]) {
    const list = entry.authors?.length
      ? entry.authors
      : entry.author
        ? [entry.author]
        : [];
    for (const a of list) {
      const name = a?.name;
      if (name && !seen.has(name)) { seen.add(name); out.push({ name, url: a?.url }); }
    }
  }
  return out;
}
