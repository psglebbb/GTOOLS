import { CSSProperties } from "react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import { Tag } from "./Tag";
import { AuthorPlates } from "./AuthorPlates";
import { colorForTagInGroup } from "./tagColors";
import { colorForCategory } from "./gtoolsData";

// One box for both tools and news. Three display modes:
//   title        → the big WWW. URL link
//   picture      → the feature image
//   pictureTitle → the image with the title overlaid in difference blend
export function Box({ entry }: { entry: any }) {
  const mode: "title" | "picture" | "pictureTitle" =
    entry.displayMode ?? (entry.featureImage ? "picture" : "title");
  const categoryColor = colorForCategory(entry.category);
  const displayUrl = formatUrl(entry.url ?? "");
  const imageUrl = entry.featureImage ? urlFor(entry.featureImage).width(840).url() : null;
  const dims = entry.imgDims; // { width, height, aspectRatio } from Sanity

  const showPicture = (mode === "picture" || mode === "pictureTitle") && imageUrl;
  const showTitleSolo = mode === "title" && entry.url;
  const overlayTitle = mode === "pictureTitle" && entry.url;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-section)" }}>
      {/* Edited stamp */}
      {entry.editedAt && (
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(195,195,195,0.55)" }}>
          Edited on {formatDate(entry.editedAt)}
        </span>
      )}

      {/* Author(s) */}
      <AuthorPlates entry={entry} />

      {/* Picture — optionally with the title overlaid in difference blend */}
      {showPicture && (
        <div style={{ position: "relative", width: "100%", borderRadius: "var(--radius-tag)", overflow: "hidden", lineHeight: 0 }}>
          <Image
            src={imageUrl!}
            alt={entry.title ?? "Box image"}
            width={dims?.width ?? 840}
            height={dims?.height ?? 560}
            style={{ width: "100%", height: "auto", display: "block" }}
            sizes="(max-width: 700px) 378px, 420px"
          />
          {overlayTitle && (
            <a
              href={entry.url}
              target="_blank"
              rel="noopener noreferrer"
              className="tool-www"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                letterSpacing: "-0.04em",
                textAlign: "center",
                textTransform: "uppercase",
                whiteSpace: "pre-line",
                wordBreak: "break-word",
                padding: "8px",
                color: "#FFFFFF",
                mixBlendMode: "difference",
                textDecoration: "none",
              } as CSSProperties}
            >
              {displayUrl}
            </a>
          )}
        </div>
      )}

      {/* Title-only mode — the big WWW. link (grey, category colour on hover) */}
      {showTitleSolo && (
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className="tool-www"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            letterSpacing: "-0.04em",
            textAlign: "center",
            textTransform: "uppercase",
            whiteSpace: "pre-line",
            wordBreak: "break-word",
            padding: "8px 8px",
            display: "block",
            textDecoration: "none",
            cursor: "pointer",
            // Visible URL title always carries its category colour (key on mobile,
            // where there's no hover).
            color: categoryColor,
          } as CSSProperties}
        >
          {displayUrl}
        </a>
      )}

      {/* Function */}
      {entry.functionValue && (
        <Tag
          group={entry.functionLabel ?? "Function:"}
          value={entry.functionValue}
          color="transparent"
          width="100%"
          multiline
          style={{ color: "var(--plate-quiet)" }}
        />
      )}

      {/* Description */}
      {entry.description && (
        <p style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: 13, lineHeight: "15px", letterSpacing: "-0.04em",
          color: "var(--ink-on-dark)",
        }}>
          {entry.description}
        </p>
      )}

      {/* Tags */}
      {(entry.tags?.length ?? 0) > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--gap-row)", marginTop: "var(--gap-divide)" }}>
          {entry.tags.map((tag: any, i: number) => (
            <Tag key={i} group={tag.group} value={tag.value} color={colorForTagInGroup(tag.group, tag.value, tag.color)} valueCase={tag.group === "AUTHOR" || tag.group === "EVENT" ? undefined : "title"} />
          ))}
        </div>
      )}
    </div>
  );
}

function formatUrl(url: string): string {
  const clean = url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
  const [host = "", ...pathParts] = clean.split("/").filter(Boolean);
  const lastDot = host.lastIndexOf(".");
  const name = lastDot > 0 ? host.slice(0, lastDot + 1) : host;
  const ext = lastDot > 0 ? host.slice(lastDot + 1) : "";

  const lines = ["WWW.", name, ext + "/"];
  for (const p of pathParts) lines.push(p + "/");
  return lines.join("\n");
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
