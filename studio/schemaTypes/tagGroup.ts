import { createElement } from "react";
import { defineField, defineType } from "sanity";
import { hslToHex } from "./tagColor";

// A tag group (ACCESS, LICENSE, EXPORT, …) is now its own document, so groups can
// be added / renamed / recoloured in the Studio — the same self-serve pattern as
// Big Categories. `baseHue` (+ optional saturation/lightness) seeds the colour
// generator that auto-fills every tag's colour; `code` is the stable ALL-CAPS id
// the frontend reads (projected as each tag's `group`).
export const tagGroupSchema = defineType({
  name: "tagGroup",
  title: "Tag Group",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "code",
      title: "Code (id)",
      description: "Stable id in ALL CAPS the site reads (e.g. ACCESS).",
      type: "string",
      validation: (Rule) => Rule.required().uppercase(),
    }),
    defineField({
      name: "baseHue",
      title: "Base hue (0–360)",
      description: "Seeds the colour generator for every tag in this group.",
      type: "number",
      initialValue: 200,
      validation: (Rule) => Rule.required().min(0).max(360),
    }),
    defineField({
      name: "baseSat",
      title: "Base saturation (0–100)",
      type: "number",
      initialValue: 65,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "baseLightness",
      title: "Base lightness (0–100)",
      type: "number",
      initialValue: 68,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
    }),
  ],
  orderings: [
    { title: "Order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
  ],
  preview: {
    select: {
      title: "title",
      code: "code",
      hue: "baseHue",
      sat: "baseSat",
      lightness: "baseLightness",
    },
    prepare({ title, code, hue, sat, lightness }) {
      const hex =
        typeof hue === "number" ? hslToHex(hue, sat ?? 65, lightness ?? 68) : undefined;
      return {
        title: title || code || "(untitled group)",
        subtitle: [code, hex].filter(Boolean).join(" · "),
        media: () =>
          createElement("span", {
            style: {
              display: "block",
              width: "100%",
              height: "100%",
              background: hex || "transparent",
            },
          }),
      };
    },
  },
});
