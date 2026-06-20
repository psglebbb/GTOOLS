import { defineField, defineType } from "sanity";

// How the box renders: a title link, a picture, or a picture with the title
// overlaid in difference blend mode.
const DISPLAY_MODES = [
  { title: "Title / URL", value: "title" },
  { title: "Picture", value: "picture" },
  { title: "Picture + Title (difference)", value: "pictureTitle" },
];

export const toolSchema = defineType({
  name: "tool",
  title: "Box (Tool / News)",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Name",
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
      name: "category",
      title: "Big Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayMode",
      title: "Display",
      type: "string",
      description: "How this box shows up in its column.",
      options: { list: DISPLAY_MODES, layout: "radio" },
      initialValue: "title",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "url",
      title: "URL (title link)",
      type: "url",
      hidden: ({ parent }) => parent?.displayMode === "picture",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mode = (context.parent as { displayMode?: string })?.displayMode;
          if (mode !== "picture" && !value) return "URL is required for title display modes";
          return true;
        }),
    }),
    defineField({
      name: "featureImage",
      title: "Picture",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.displayMode === "title",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const mode = (context.parent as { displayMode?: string })?.displayMode;
          if (mode !== "title" && !value) return "Picture is required for picture display modes";
          return true;
        }),
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
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
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
    select: { title: "title", subtitle: "category.title", media: "featureImage" },
  },
});
