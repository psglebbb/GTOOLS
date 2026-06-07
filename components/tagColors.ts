// GTOOLS tag colour palette.
//
// Every tag starts from the neutral base (#c3c3c3) and is tinted by its group.
// Within a group, each tag value gets its OWN distinct shade of the group's
// hue family (so e.g. GIF / JPEG / MP4 / PDF are all green — but each a
// *different* green). Shades are generated deterministically by spreading
// hue + lightness across the group's ordered value list.
//
// Groups: A Preis & Zugang (warm yellow) · B Lizenz & Gemeinschaft (slate) ·
// C Platform & OS (warm grey) · D Export-Formate (green) · E Fonts (rosé) ·
// F Small-Tech (blue-violet) · G Web (teal).

export const TAG_NEUTRAL = "#c3c3c3";

// EVENT tags carry arbitrary event names, so they never map to a palette shade.
// Pin them to one fixed colour so an EVENT tag looks identical everywhere.
export const TAG_EVENT = "var(--tag-access-base)";

interface GroupDef {
  h: number;          // base hue
  s: number;          // base saturation %
  l: number;          // base lightness %
  hueSpread: number;  // total hue spread across the members
  lightSpread: number;// total lightness spread across the members
  values: string[];   // ordered — assignment of shades follows this order
}

const GROUPS: GroupDef[] = [
  // A — Preis & Zugang (warm yellow)
  { h: 46, s: 48, l: 68, hueSpread: 16, lightSpread: 22,
    values: ["Free", "Free Trial", "One-Time Payment", "Subscription"] },

  // B — Lizenz & Gemeinschaft (cool slate)
  { h: 205, s: 28, l: 64, hueSpread: 20, lightSpread: 24,
    values: ["Community", "Independent Authors", "Open Source", "GitHub Repositories", "GitHub"] },

  // C — Platform & OS (warm grey)
  { h: 33, s: 16, l: 60, hueSpread: 22, lightSpread: 24,
    values: ["Browser", "Desktop", "Mobile", "Tablet", "Linux", "Mac OS", "Windows"] },

  // D — Export-Formate (green — wide spread so each format is its own green)
  { h: 122, s: 24, l: 60, hueSpread: 40, lightSpread: 30,
    values: ["GIF", "JPEG", "MP4", "PDF", "PNG", "STL", "SVG", "TIFF", "WebM", "Embed Code", "Embed Export", "3D / STL", "3D"] },

  // E — Fonts-spezifisch (rosé-grey)
  { h: 335, s: 22, l: 66, hueSpread: 26, lightSpread: 22,
    values: ["Archives", "Cultural Sales", "FLINTA+ Foundries", "Font Prototyping", "Foundries", "Student Discount", "Variable Type", "Type Design"] },

  // F — Small-Tech-spezifisch (pale blue-violet)
  { h: 250, s: 24, l: 66, hueSpread: 26, lightSpread: 22,
    values: ["Archive.org", "Old Applications", "p5.js"] },

  // G — Web-spezifisch (muted teal)
  { h: 180, s: 26, l: 56, hueSpread: 26, lightSpread: 22,
    values: ["Plugins", "Shop", "Standards", "Web Constructors"] },
];

function hslToHex(h: number, s: number, l: number): string {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const c = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * c).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

const MAP: Record<string, string> = {};
for (const g of GROUPS) {
  const n = g.values.length;
  g.values.forEach((value, i) => {
    // Spread each member symmetrically around the base; t in [-0.5, 0.5].
    const t = n > 1 ? i / (n - 1) - 0.5 : 0;
    const hex = hslToHex(g.h + g.hueSpread * t, g.s, g.l + g.lightSpread * t);
    MAP[norm(value)] = hex;
  });
}

// Colour for a tag value. Falls back to an explicit colour, then the neutral base.
export function colorForTag(value: string, fallback?: string): string {
  return MAP[norm(value)] ?? fallback ?? TAG_NEUTRAL;
}

// Group-aware colour: EVENT tags are always the one fixed EVENT colour,
// everything else resolves by value as usual.
export function colorForTagInGroup(group: string, value: string, fallback?: string): string {
  if (group === "EVENT") return TAG_EVENT;
  return colorForTag(value, fallback);
}
