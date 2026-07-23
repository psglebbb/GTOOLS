"use client";

// Defaults — used verbatim when the Sanity "Footer / Info" singleton is empty
// or hasn't been created yet, so the footer keeps working before it's filled in.
const DEFAULT_STUDIO_URL = "https://www.o-g-o.studio/";
const DEFAULT_EMAIL = "hio@o-g-o.studio";

const DEFAULT_EN_TEXT = `The online collection is presented as a curated series of links, each accompanied by the author's name, the tool's function, its general category, and a concise introductory description. The tools were gathered from internet archives, online communities, social media, and creative coding platforms.\n\nThe Graphic Tools Museum (GTOOLS)\nis based in Linz, Austria.\n\nFor further information:\n`;

const DEFAULT_DE_TEXT = `Die Online-Sammlung wird als kuratierte Reihe von Links präsentiert, jeweils mit Namen der Autor*innen, der Funktion des Tools, einer allgemeinen Kategorie und einer kurzen Beschreibung. Die Tools stammen aus Internet-Archiven, Online-Communities, sozialen Medien und Creative-Coding-Plattformen.\n\nDas Graphic Tools Museum (GTOOLS)\nhat seinen Sitz in Linz, Österreich.\n\nFür weitere Informationen:\n`;

// Shape of the Sanity "Footer / Info" singleton (all fields optional — the
// Footer falls back to the DEFAULT_* constants for anything missing).
export interface FooterContent {
  deText?: string | null;
  enText?: string | null;
  email?: string | null;
  studioUrl?: string | null;
  contactLinks?: { label: string; url: string }[] | null;
}

interface Props {
  mode: "closed" | "info";
  lang: "EN" | "DE";
  onTabChange: (m: "closed" | "info") => void;
  onLangChange: (l: "EN" | "DE") => void;
  content?: FooterContent | null;
}

function Tab({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      style={{ cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1.8 }}
    >
      <div style={{ height: 1.8, width: 35.1, background: active ? "var(--accent-purple)" : "transparent" }} />
      <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14.4, lineHeight: "14.4px", letterSpacing: "-0.05em", color: active ? "var(--accent-purple)" : "rgb(0,0,0)", minWidth: 35.1, textAlign: "center" }}>
        {label}
      </span>
    </div>
  );
}

export function Footer({ mode, lang, onTabChange, onLangChange, content }: Props) {
  const isInfo = mode === "info";

  // Resolve editable content, falling back to the hardcoded defaults.
  const studioUrl = content?.studioUrl || DEFAULT_STUDIO_URL;
  const email = content?.email || DEFAULT_EMAIL;
  const bodyText =
    lang === "EN"
      ? content?.enText || DEFAULT_EN_TEXT
      : content?.deText || DEFAULT_DE_TEXT;
  const contactLinks = content?.contactLinks ?? [];

  return (
    <div
      // Collapsed: clicking anywhere on the bar opens Info. Inner tabs stopPropagation.
      onClick={isInfo ? undefined : () => onTabChange("info")}
      style={{
        width: "100%",
        borderRadius: "var(--radius-footer)",
        background: "var(--surface)",
        padding: isInfo ? "6px 7px" : "3.6px 6.3px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: isInfo ? 14 : 24,
        overflow: "hidden",
        maxHeight: isInfo ? 460 : 70,
        cursor: isInfo ? "default" : "pointer",
        transition: "max-height 380ms cubic-bezier(.22,.61,.36,1), padding 220ms linear, gap 220ms linear",
      }}
    >
      {/* Copyright row — links to the studio */}
      <a
        href={studioUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: isInfo ? 9 : 8.1, lineHeight: isInfo ? "10px" : "9px", letterSpacing: "0.07em", color: "var(--accent-purple)", textTransform: "uppercase", textDecoration: "none", cursor: "pointer", transition: "font-size 220ms linear" }}
      >
        © 2026. Designed / Hosted by OGO S.T.U. (STUDIO)<br />Original Graphic Order
      </a>

      {/* Brand + tabs */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: isInfo ? 16 : 14.4, lineHeight: isInfo ? "17px" : "15.3px", letterSpacing: "-0.05em", color: "rgb(2,2,2)", transition: "font-size 220ms linear" }}>
          GTOOLS — The Graphic Tools Museum
        </span>
        {!isInfo ? (
          <div style={{ display: "flex", gap: 7.2, alignItems: "center" }}>
            <Tab label="Tools" active={true}  onClick={() => onTabChange("closed")} />
            <Tab label="Info"  active={false} onClick={() => onTabChange("info")} />
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Tab label="DE" active={lang === "DE"} onClick={() => onLangChange("DE")} />
            <Tab label="EN" active={lang === "EN"} onClick={() => onLangChange("EN")} />
          </div>
        )}
      </div>

      {/* Info panel — fades in */}
      <div style={{
        display: "flex", flexDirection: "column", gap: 16,
        opacity: isInfo ? 1 : 0,
        transform: isInfo ? "translateY(0)" : "translateY(-6px)",
        transition: isInfo
          ? "opacity 220ms 140ms linear, transform 320ms 140ms cubic-bezier(.22,.61,.36,1)"
          : "opacity 160ms linear, transform 220ms cubic-bezier(.22,.61,.36,1)",
        pointerEvents: isInfo ? "auto" : "none",
      }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, lineHeight: "16px", letterSpacing: "-0.04em", color: "rgb(0,0,0)", whiteSpace: "pre-line", margin: 0 }}>
          {bodyText}
          <a
            href={`mailto:${email}`}
            onClick={(e) => e.stopPropagation()}
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            {email}
          </a>
          {contactLinks.map((link) => (
            <span key={link.url}>
              {"\n"}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{ color: "inherit", textDecoration: "underline" }}
              >
                {link.label}
              </a>
            </span>
          ))}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href={studioUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ display: "inline-flex" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/OGO_GTOOLS.svg" alt="OGO — GTOOLS" style={{ height: 30, width: "auto" }} />
          </a>
          <div style={{ display: "flex", gap: 8 }}>
            <Tab label="Tools" active={false} onClick={() => onTabChange("closed")} />
            <Tab label="Info"  active={true}  onClick={() => onTabChange("info")} />
          </div>
        </div>
      </div>
    </div>
  );
}
