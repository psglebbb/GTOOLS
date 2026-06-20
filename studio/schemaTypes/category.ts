import { defineField, defineType } from "sanity";

// A big category is now its own document, so new ones can be added in the Studio
// (a new category → a new folder in the sidebar, automatically). Each box
// (`tool`) references one of these. `slug.current` is the stable id the frontend
// filters on (e.g. "fonts"); `color` drives that category's colour everywhere.
export const categorySchema = defineType({
  name: "category",
  title: "Big Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Name",
      description: "Shown as the column header (usually ALL CAPS, e.g. FONTS).",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Id (slug)",
      description: "The stable id the site filters on — lowercase, no spaces (e.g. fonts).",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "color",
      title: "Colour",
      description: "Hex colour for this category's plate + links (e.g. #FF35FF).",
      type: "string",
      validation: (Rule) =>
        Rule.required().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, {
          name: "hex colour",
        }),
    }),
    defineField({
      name: "order",
      title: "Order",
      description: "Position of the column (lower = earlier).",
      type: "number",
      validation: (Rule) => Rule.required(),
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", subtitle: "color" },
  },
});
