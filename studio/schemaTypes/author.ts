import { defineField, defineType } from "sanity";

export const authorSchema = defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "Link (website / profile)",
      description: "If set, the author's name becomes clickable (opens in a new tab).",
      type: "url",
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});