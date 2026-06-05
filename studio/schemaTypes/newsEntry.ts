import { defineField, defineType } from "sanity";

export const newsEntrySchema = defineType({
  name: "newsEntry",
  title: "News Entry",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
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
      name: "featureImage",
      title: "Feature Image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "functionLabel",
      title: "Function Label",
      type: "string",
      initialValue: "Come by:",
    }),
    defineField({
      name: "functionValue",
      title: "Function / Event details",
      type: "text",
      rows: 5,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
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
    select: { title: "title", media: "featureImage" },
  },
});