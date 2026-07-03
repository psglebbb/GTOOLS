import { createElement } from "react";
import { defineField, defineType } from "sanity";
import { TagColorInput } from "./components/TagColorInput";

// Tags are now shared documents (one per value), referenced from boxes: on a box
// you pick an existing tag or create a new one, and it joins the shared pool for
// next time. `group` points at a tagGroup document; `color` is auto-filled from
// that group's base hue (see TagColorInput) and stays hand-editable.
export const tagSchema = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    defineField({
      name: "value",
      title: "Value",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "group",
      title: "Group",
      type: "reference",
      to: [{ type: "tagGroup" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "color",
      title: "Colour (auto from group)",
      type: "string",
      components: { input: TagColorInput },
    }),
  ],
  preview: {
    select: { title: "value", group: "group.code", color: "color" },
    prepare({ title, group, color }) {
      return {
        title,
        subtitle: group,
        media: () =>
          createElement("span", {
            style: {
              display: "block",
              width: "100%",
              height: "100%",
              background: color || "transparent",
            },
          }),
      };
    },
  },
});
