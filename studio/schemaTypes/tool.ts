import { defineField, defineType } from "sanity";

const CATEGORIES = [
  { title: "Alternative Software", value: "alt" },
  { title: "FONTS", value: "fonts" },
  { title: "SMALL-TECH", value: "small" },
  { title: "BIG-TECH", value: "big" },
  { title: "WEB", value: "web" },
];

export const toolSchema = defineType({
  name: "tool",
  title: "Tool",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Tool Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL",
      type: "url",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: CATEGORIES, layout: "radio" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "authors",
      title: "Authors",
      description:
        "One or more — a single person, a team, or a list of contributors.",
      type: "array",
      of: [{ type: "reference", to: [{ type: "author" }] }],
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "author",
      title: "Author (legacy — single)",
      type: "reference",
      to: [{ type: "author" }],
      hidden: ({ value }) => !value,
    }),
    defineField({
      name: "functionLabel",
      title: "Function Label",
      type: "string",
      initialValue: "Function:",
    }),
    defineField({
      name: "functionValue",
      title: "Function",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "tag" }],
    }),
    defineField({
      name: "editedAt",
      title: "Edited on",
      type: "date",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "category" },
  },
});