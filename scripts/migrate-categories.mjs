// One-off migration: make big categories self-serve.
//   1) Create the 6 existing categories as `category` documents (title/color/order).
//   2) Convert every tool's `category` string ("fonts") into a reference to the
//      matching category doc (`category-fonts`).
// Idempotent: category docs use createIfNotExists; tools are only patched while
// their `category` is still a string (skips already-migrated refs). Re-runnable.
//
// Token: read from .env.local (SANITY_API_TOKEN) or SANITY_WRITE_TOKEN env.
// Run: node scripts/migrate-categories.mjs

import { readFileSync } from "node:fs";

const PID = "zgw7guo3";
const DS = "production";
const API = `https://${PID}.api.sanity.io/v2021-10-21`;

// Read token from env, falling back to .env.local (same file the app uses).
function readToken() {
  if (process.env.SANITY_WRITE_TOKEN) return process.env.SANITY_WRITE_TOKEN;
  if (process.env.SANITY_API_TOKEN) return process.env.SANITY_API_TOKEN;
  try {
    const env = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    const m = env.match(/^SANITY_API_TOKEN=(.+)$/m);
    if (m) return m[1].trim();
  } catch {}
  return null;
}
const TOKEN = readToken();
if (!TOKEN) { console.error("Missing SANITY_API_TOKEN / SANITY_WRITE_TOKEN"); process.exit(1); }

// The 6 existing categories. Colours = hex of the current --cat-* CSS vars;
// order matches the frontend column order (authors is a computed pseudo-column,
// not a real category, so it is intentionally absent).
const CATEGORIES = [
  { value: "news",  title: "NEWS",                 color: "#FFEA00", order: 0 },
  { value: "alt",   title: "Alternative Software", color: "#0DFF00", order: 1 },
  { value: "fonts", title: "FONTS",                color: "#FF35FF", order: 2 },
  { value: "small", title: "SMALL-TECH",           color: "#35A1FF", order: 3 },
  { value: "big",   title: "BIG-TECH",             color: "#FF3535", order: 4 },
  { value: "web",   title: "WEB",                  color: "#E0FFA3", order: 5 },
];
const catId = (value) => `category-${value}`;

async function query(q) {
  const r = await fetch(`${API}/data/query/${DS}?query=${encodeURIComponent(q)}`,
    { headers: { Authorization: `Bearer ${TOKEN}` } });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error));
  return j.result;
}

async function mutate(mutations) {
  const r = await fetch(`${API}/data/mutate/${DS}?returnIds=true`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations }),
  });
  const j = await r.json();
  if (j.error) throw new Error(JSON.stringify(j.error, null, 2));
  return j;
}

async function main() {
  const mutations = [];

  // 1) Category docs (idempotent — won't clobber later edits).
  for (const c of CATEGORIES) {
    mutations.push({
      createIfNotExists: {
        _id: catId(c.value),
        _type: "category",
        title: c.title,
        slug: { _type: "slug", current: c.value },
        color: c.color,
        order: c.order,
      },
    });
  }

  // 2) Convert tools whose category is still a string → reference.
  const tools = await query(
    `*[_type=="tool"]{_id, "cat": category, "isRef": defined(category._ref)}`
  );
  const known = new Set(CATEGORIES.map((c) => c.value));
  let toConvert = 0, skipped = 0, unknown = [];
  for (const t of tools) {
    if (t.isRef) { skipped++; continue; }          // already migrated
    if (typeof t.cat !== "string") { skipped++; continue; }
    if (!known.has(t.cat)) { unknown.push({ id: t._id, cat: t.cat }); continue; }
    mutations.push({
      patch: {
        id: t._id,
        set: { category: { _type: "reference", _ref: catId(t.cat) } },
      },
    });
    toConvert++;
  }

  if (unknown.length) {
    console.warn(`⚠ ${unknown.length} tool(s) have an UNKNOWN category — not converted:`);
    for (const u of unknown) console.warn(`   ${u.id} → "${u.cat}"`);
  }

  console.log(`Tools: ${tools.length} total · ${toConvert} to convert · ${skipped} already-ref/skip`);
  console.log(`Submitting ${mutations.length} mutations…`);
  const res = await mutate(mutations);
  console.log(`✓ Done (${res.results?.length ?? 0} results).`);

  // Verify
  const left = await query(`count(*[_type=="tool" && !defined(category._ref)])`);
  const refs = await query(`array::unique(*[_type=="tool"].category._ref)`);
  console.log(`Verify: tools without category ref = ${left}`);
  console.log(`Verify: distinct category refs = ${JSON.stringify(refs)}`);
}

main().catch((e) => { console.error("✗ FAILED:\n", e.message); process.exit(1); });
