import { CSSProperties } from "react";

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
}: TagProps) {
  const bg = outline ? "#000" : color;
  const txtColor = outline ? "rgb(195,195,195)" : (style?.color ?? "rgb(2,2,2)");

  return (
    <div
      onClick={onClick}
      style={{
        position: "relative",
        borderRadius: "var(--radius-tag)",
        background: bg,
        color: txtColor,
        padding: "4px 18px 4px 8px",
        minHeight,
        width,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 2,
        cursor: onClick ? "pointer" : "default",
        ...style,
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
        }}
      >
        {value}
      </span>
    </div>
  );
}
