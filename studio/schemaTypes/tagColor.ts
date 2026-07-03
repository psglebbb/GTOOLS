// Colour math ported from GTOOLS_tag_colors(1).html so the generator now lives
// inside the Studio: an HSL base (per tag group) becomes a hex tag colour, with a
// WCAG guard that lightens the tone until it stays legible on the near-black
// (#020202) surface. Shared by the tagGroup preview swatch and TagColorInput.

export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return (
    "#" +
    [f(0), f(8), f(4)]
      .map((x) => Math.round(x * 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const c = (v: number) => {
    v /= 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * c(r) + 0.7152 * c(g) + 0.0722 * c(b);
}

export function contrastRatio(h1: string, h2: string): number {
  const L1 = relativeLuminance(...hexToRgb(h1));
  const L2 = relativeLuminance(...hexToRgb(h2));
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
}

export function wcagLevel(bgHex: string): {
  level: "AAA" | "AA" | "FAIL";
  ratio: number;
} {
  const ratio = contrastRatio(bgHex, "#020202");
  return { level: ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : "FAIL", ratio };
}

export interface GroupBase {
  hue: number;
  sat?: number;
  lightness?: number;
}

// The lightness ramp each group is spread across, so tags in one group share a
// hue but read as distinct tones (mirrors the 5 swatches per group in the
// original generator).
export const TONE_RAMP = [78, 73, 68, 63, 58];

// A tag tone for a group's base hue. Three modes give tags in a group a diverse
// yet coherent family instead of identical chips:
//   • index  — deterministic: pick the next step on the tonal ramp (used on
//              auto-fill, indexed by how many tags the group already has).
//   • jitter — the ↺ button: random ramp step + small hue/saturation nudge.
//   • neither — the plain base tone.
// Lightness is then raised until the tone clears WCAG AA on #020202.
export function generateTone(
  base: GroupBase,
  opts: { index?: number; jitter?: boolean } = {},
): string {
  const { index, jitter } = opts;
  const s0 = base.sat ?? 65;
  let hV = base.hue;
  let sV = s0;
  let lV = base.lightness ?? 68;

  if (typeof index === "number") {
    const i = ((index % TONE_RAMP.length) + TONE_RAMP.length) % TONE_RAMP.length;
    lV = TONE_RAMP[i];
    // Each time the ramp wraps (a group has more tags than steps), rotate the
    // hue a touch so tag 6, 11, … stay distinct from tag 1 rather than repeating.
    hV = base.hue + Math.floor(index / TONE_RAMP.length) * 7;
  }
  if (jitter) {
    hV = base.hue + (Math.random() - 0.5) * 12;
    sV = Math.min(100, Math.max(20, s0 + (Math.random() - 0.5) * 18));
    lV = TONE_RAMP[Math.floor(Math.random() * TONE_RAMP.length)];
  }

  let hex = hslToHex(hV, sV, lV);
  let t = 0;
  while (wcagLevel(hex).level === "FAIL" && t++ < 20) {
    lV += 3;
    hex = hslToHex(hV, sV, Math.min(95, lV));
  }
  return hex;
}
