import { defineField, defineType } from "sanity";

const TAG_GROUPS = [
  { title: "ACCESS", value: "ACCESS" },
  { title: "LICENSE", value: "LICENSE" },
  { title: "EXPORT", value: "EXPORT" },
  { title: "PLATFORM", value: "PLATFORM" },
  { title: "TYPO", value: "TYPO" },
  { title: "ROOTS", value: "ROOTS" },
  { title: "BROWSER", value: "BROWSER" },
  { title: "AUTHOR", value: "AUTHOR" },
  { title: "EVENT", value: "EVENT" },
];

export const tagSchema = defineType({
  name: "tag",
  title: "Tag",
  type: "object",
  fields: [
    defineField({
      name: "group",
      title: "Group",
      type: "string",
      options: { list: TAG_GROUPS },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "color",
      title: "CSS color variable",
      type: "string",
    }),
  ],
  preview: {
    select: { title: "value", subtitle: "group" },
  },
});