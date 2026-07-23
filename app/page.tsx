import { sanityFetch } from "@/sanity/lib/client";
import { ALL_NEWS_QUERY, ALL_TOOLS_QUERY, CATEGORIES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { GToolsApp } from "@/components/GToolsApp";
import type { Category } from "@/components/gtoolsData";
import type { FooterContent } from "@/components/Footer";

// Revalidate every 60 seconds (ISR)
export const revalidate = 60;

export default async function HomePage() {
  const [news, tools, categories, footer] = await Promise.all([
    sanityFetch<any[]>(ALL_NEWS_QUERY),
    sanityFetch<any[]>(ALL_TOOLS_QUERY),
    sanityFetch<Category[]>(CATEGORIES_QUERY),
    sanityFetch<FooterContent | null>(SITE_SETTINGS_QUERY),
  ]);

  return <GToolsApp news={news} tools={tools} categories={categories} footer={footer} />;
}
