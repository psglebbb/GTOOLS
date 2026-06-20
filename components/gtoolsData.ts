// Shared category definitions + derived data for the GTOOLS layout.
// Used by both the mobile (single column) and desktop (horizontal column strip) views.

export interface Category {
  id: string;
  label: string;
  color: string;
  outline?: boolean;
}

// The big categories now come from Sanity (CATEGORIES_QUERY). `authors` is not a
// real category — it's a computed view (the All-Authors column), appended to the
// fetched list client-side so it shows up as the last column.
export const AUTHORS_CATEGORY: Category = {
  id: "authors",
  label: "ALL AUTHORS",
  color: "transparent",
  outline: true,
};

// Fetched categories + the synthetic Authors column.
export function withAuthorsColumn(categories: Category[]): Category[] {
  return [...categories, AUTHORS_CATEGORY];
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
