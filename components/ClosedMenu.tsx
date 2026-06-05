"use client";

import { useState } from "react";

interface Category {
  id: string;
  label: string;
  color: string;
  outline?: boolean;
}

interface Props {
  categories: Category[];
  activeId: string;
  onSelect: (id: string) => void;
  rowH?: number;
  overlap?: number;
}

export function ClosedMenu({ categories, activeId, onSelect, rowH = 34.2, overlap = 26 }: Props) {
  const [open, setOpen] = useState(false);

  const ordered = (() => {
    const active = categories.find((c) => c.id === activeId);
    const rest = categories.filter((c) => c.id !== activeId);
    return active ? [active, ...rest] : categories;
  })();

  return (
    <div
      onClick={() => { if (!open) setOpen(true); }}
      style={{ width: "100%", display: "flex", flexDirection: "column", cursor: "pointer", userSelect: "none" }}
    >
      {ordered.map((c, i) => {
        const isTop = i === 0;
        const z = ordered.length - i;
        const buried = !open && !isTop;

        return (
          <div
            key={c.id}
            onClick={(e) => {
              e.stopPropagation();
              if (!open) { setOpen(true); return; }
              if (!isTop) onSelect(c.id);
              setOpen(false);
            }}
            style={{
              position: "relative",
              height: rowH,
              borderRadius: 1,
              padding: "4px 24px 4px 8px",
              boxSizing: "border-box",
              background: c.outline ? "#000" : c.color,
              color: c.outline ? "rgb(195,195,195)" : "rgb(2,2,2)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              marginTop: isTop ? 0 : open ? 2 : -overlap,
              transition: "margin-top 380ms cubic-bezier(.22,.61,.36,1)",
              zIndex: z,
              willChange: "margin-top",
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
                opacity: buried ? 0 : 1,
                transition: buried
                  ? "opacity 120ms linear"
                  : "opacity 220ms 120ms linear",
              }}
            >
              Category
            </span>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 16,
                lineHeight: "16px",
                letterSpacing: "-0.05em",
                whiteSpace: "nowrap",
                textTransform: "uppercase",
                opacity: buried ? 0 : 1,
                transition: buried
                  ? "opacity 120ms linear"
                  : "opacity 220ms 120ms linear",
              }}
            >
              {c.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
