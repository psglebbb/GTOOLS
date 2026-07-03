// One-off migration: inline tag objects -> shared tag documents + tagGroup docs.
//
// Preferred (uses your existing Sanity CLI login — run from the studio/ dir):
//   Dry run:   npx sanity exec ./migrate-tags.mjs --with-user-token
//   Execute:   npx sanity exec ./migrate-tags.mjs --with-user-token -- --write
//
// Or with an explicit token (from the studio/ dir):
//   Dry run:   SANITY_WRITE_TOKEN=sk... node migrate-tags.mjs
//   Execute:   SANITY_WRITE_TOKEN=sk... node migrate-tags.mjs --write
//
// What it does, idempotently (deterministic hyphen _ids, createIfNotExists):
//   1. Ensures a `tagGroup` doc per group (base hue seeds the colour generator).
//   2. For every distinct (group, value) on any box's inline `tags`, creates a
//      shared `tag` doc — reusing the inline colour if present, else generating a
//      WCAG-checked tone from the group's base hue.
//   3. Repoints each box's `tags` array to references of those tag docs.
//
// Run this BEFORE deploying the reference schema + the `tags[]->` frontend query,
// so existing tags don't disappear on the live site.

const PID = "zgw7guo3";
const DS = "production";
const API = `https://${PID}.api.sanity.io/v2021-10-21`;
const TOKEN = process.env.SANITY_WRITE_TOKEN;
const WRITE = process.argv.includes("--write");

// Two ways in: a raw token (SANITY_WRITE_TOKEN), or the CLI's logged-in user
// token when launched via `sanity exec --with-user-token` (getCliClient).
let cliClient = null;
if (!TOKEN) {
  try {
    const { getCliClient } = await import("sanity/cli");
    cliClient = getCliClient({ apiVersion: "2021-10-21" });
  } catch {
    console.error(
      "No SANITY_WRITE_TOKEN and not running under `sanity exec --with-user-token`.",
    );
    process.exit(1);
  }
}

// Base HSL per group, carried over from GTOOLS_tag_colors(1).html (AUTHOR/EVENT
// were not in the generator — sensible defaults). `order` drives sidebar order.
const GROUP_SEED = {
  ACCESS: { title: "Access", hue: 45, sat: 58, lightness: 69, order: 1 },
  LICENSE: { title: "License", hue: 115, sat: 35, lightness: 65, order: 2 },
  EXPORT: { title: "Export", hue: 35, sat: 100, lightness: 69, order: 3 },
  PLATFORM: { title: "Platform", hue: 345, sat: 100, lightness: 80, order: 4 },
  TYPO: { title: "Typo", hue: 265, sat: 100, lightness: 87, order: 5 },
  ROOTS: { title: "Roots", hue: 180, sat: 45, lightness: 68, order: 6 },
  BROWSER: { title: "Browser", hue: 40, sat: 14, lightness: 75, order: 7 },
  AUTHOR: { title: "Author", hue: 210, sat: 40, lightness: 70, order: 8 },
  EVENT: { title: "Event", hue: 300, sat: 60, lightness: 70, order: 9 },
};

// ── colour math (mirrors studio/schemaTypes/tagColor.ts) ─────────────────────
function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return (
    "#" +
    [f(0), f(8), f(4)]
      .map((x) => Math.round(x * 255).toString(16).padStart(2, "0"))
      .join("")
  );
}
const hexToRgb = (hex) => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
function luminance(r, g, b) {
  const c = (v) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
}
function contrast(h1, h2) {
  const L1 = luminance(...hexToRgb(h1));
  const L2 = luminance(...hexToRgb(h2));
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}
// Deterministic tone (no jitter) so the migration is reproducible.
function generateTone({ hue, sat = 65, lightness = 68 }) {
  let l = lightness;
  let hex = hslToHex(hue, sat, l);
  let t = 0;
  while (contrast(hex, "#020202") < 4.5 && t++ < 20) {
    l += 3;
    hex = hslToHex(hue, sat, Math.min(95, l));
  }
  return hex;
}

const slugify = (s) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const groupId = (code) => `tagGroup-${code.toLowerCase()}`;
const tagId = (code, value) => `tag-${code.toLowerCase()}-${slugify(value)}`;

async function query(q) {
  if (cliClient) return cliClient.fetch(q);
  const r = await fetch(
    `${API}/data/query/${DS}?query=${encodeURIComponent(q)}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } },
  );
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return j.result;
}

async function mutate(mutations) {
  if (!WRITE) return { dryRun: true, count: mutations.length };
  if (cliClient) {
    const tx = cliClient.transaction();
    for (const m of mutations) {
      if (m.createIfNotExists) tx.createIfNotExists(m.createIfNotExists);
      else if (m.patch) tx.patch(m.patch.id, { set: m.patch.set });
    }
    return tx.commit();
  }
  const r = await fetch(`${API}/data/mutate/${DS}?returnIds=true`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ mutations }),
  });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error, null, 2));
  return j;
}

async function main() {
  const tools = await query(
    `*[_type == "tool" && defined(tags) && count(tags) > 0]{_id, tags}`,
  );

  // Collect every distinct (group, value) and remember any inline colour.
  const groups = new Set();
  const tags = new Map(); // key `${code}:${value}` -> {code, value, color?}
  for (const t of tools) {
    for (const tag of t.tags ?? []) {
      if (!tag?.group || !tag?.value) continue;
      const code = String(tag.group).toUpperCase();
      groups.add(code);
      const key = `${code}:${tag.value}`;
      if (!tags.has(key)) tags.set(key, { code, value: tag.value, color: tag.color });
    }
  }

  const mutations = [];

  // 1. Tag groups
  for (const code of groups) {
    const seed = GROUP_SEED[code] || {
      title: code[0] + code.slice(1).toLowerCase(),
      hue: 200,
      sat: 65,
      lightness: 68,
      order: 99,
    };
    mutations.push({
      createIfNotExists: {
        _id: groupId(code),
        _type: "tagGroup",
        title: seed.title,
        code,
        baseHue: seed.hue,
        baseSat: seed.sat,
        baseLightness: seed.lightness,
        order: seed.order,
      },
    });
  }

  // 2. Shared tag docs
  for (const { code, value, color } of tags.values()) {
    const seed = GROUP_SEED[code] || { hue: 200, sat: 65, lightness: 68 };
    mutations.push({
      createIfNotExists: {
        _id: tagId(code, value),
        _type: "tag",
        value,
        group: { _type: "reference", _ref: groupId(code) },
        color: color || generateTone(seed),
      },
    });
  }

  // 3. Repoint each box's tags -> references
  for (const t of tools) {
    const refs = (t.tags ?? [])
      .filter((tag) => tag?.group && tag?.value)
      .map((tag) => {
        const code = String(tag.group).toUpperCase();
        const id = tagId(code, tag.value);
        return { _type: "reference", _ref: id, _key: id };
      });
    mutations.push({ patch: { id: t._id, set: { tags: refs } } });
  }

  console.log(
    `Boxes with tags: ${tools.length}\n` +
      `Groups: ${groups.size} (${[...groups].join(", ")})\n` +
      `Distinct tags: ${tags.size}\n` +
      `Mutations: ${mutations.length}\n` +
      (WRITE ? "Writing…" : "DRY RUN — re-run with --write to apply."),
  );

  const res = await mutate(mutations);
  console.log(WRITE ? "Done." : "(no writes performed)", res.dryRun ? "" : res);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
