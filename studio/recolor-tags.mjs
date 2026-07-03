// One-off: re-spread existing tag colours across each group's tonal ramp, so a
// group's tags read as a diverse family instead of all sharing the base tone.
// Only the `color` field is touched — fully reversible by re-running.
//
//   Dry run:  npx sanity exec ./recolor-tags.mjs --with-user-token
//   Execute:  npx sanity exec ./recolor-tags.mjs --with-user-token -- --write

import { getCliClient } from "sanity/cli";
import { generateTone, TONE_RAMP } from "./schemaTypes/tagColor";

const WRITE = process.argv.includes("--write");
const c = getCliClient({ apiVersion: "2021-10-21" });

const groups = await c.fetch(
  `*[_type == "tagGroup"]{ _id, code, baseHue, baseSat, baseLightness,
     "tags": *[_type == "tag" && group._ref == ^._id] | order(value asc){ _id, value } }`,
);

const patches = [];
for (const g of groups) {
  if (g.baseHue == null) continue;
  const base = { hue: g.baseHue, sat: g.baseSat, lightness: g.baseLightness };
  g.tags.forEach((tag, i) => {
    // Deterministic index-based tone; when a group has more tags than ramp
    // steps it wraps, so re-runs stay stable.
    const color = generateTone(base, { index: i });
    patches.push({ patch: { id: tag._id, set: { color } } });
    if (!WRITE)
      console.log(`${g.code.padEnd(9)} ${String(tag.value).padEnd(22)} -> ${color}`);
  });
}

console.log(
  `\nGroups: ${groups.length} · Tags: ${patches.length} · Ramp steps: ${TONE_RAMP.length}\n` +
    (WRITE ? "Writing…" : "DRY RUN — re-run with --write to apply."),
);

if (WRITE) {
  const tx = c.transaction();
  for (const m of patches) tx.patch(m.patch.id, { set: m.patch.set });
  await tx.commit();
  console.log("Done.");
}
