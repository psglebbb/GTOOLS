"use client";

import { CSSProperties, useState } from "react";

interface TagProps {
  group: string;
  value: string;
  color?: string;
  outline?: boolean;
  width?: string | number;
  minHeight?: number;
  style?: CSSProperties;
  onClick?: () => void;
  multiline?: boolean;
  // "upper" → ALL CAPS (big categories); "title" → Title Case (tags like Jpeg, Png).
  valueCase?: "upper" | "title";
}

// Title-case that also lowercases acronyms, so "PNG" → "Png", "Open Source" stays.
function titleCase(s: string): string {
  return s.replace(/\S+/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

export function Tag({
  group,
  value,
  color = "var(--surface)",
  outline = false,
  width,
  minHeight = 34.2,
  style = {},
  onClick,
  multiline = false,
  valueCase,
}: TagProps) {
  const [hover, setHover] = useState(false);
  const displayValue = valueCase === "title" ? titleCase(value) : value;
  // On hover every tag flips to the signal red + white type, hinting it reacts.
  const bg = hover ? "#FF0000" : (outline ? "#000" : color);
  const txtColor = hover ? "#FFFFFF" : (outline ? "rgb(195,195,195)" : (style?.color ?? "rgb(2,2,2)"));

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        borderRadius: "var(--radius-tag)",
        background: bg,
        color: txtColor,
        padding: "4px 18px 4px 8px",
        minHeight,
        width,
        maxWidth: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 2,
        cursor: onClick ? "pointer" : "default",
        transition: "background 120ms linear, color 120ms linear",
        ...style,
        ...(hover ? { color: txtColor } : {}),
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontWeight: 700,
          fontSize: 9,
          lineHeight: "10px",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: txtColor,
          whiteSpace: "nowrap",
        }}
      >
        {group}
      </span>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 16,
          lineHeight: "16px",
          letterSpacing: "-0.05em",
          color: txtColor,
          whiteSpace: multiline ? "pre-line" : "nowrap",
          overflowWrap: "break-word",
          wordBreak: "break-word",
          maxWidth: "100%",
          textTransform: valueCase === "upper" ? "uppercase" : undefined,
        }}
      >
        {displayValue}
      </span>
    </div>
  );
}
