import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import { Tag } from "./Tag";
import { AuthorPlates } from "./AuthorPlates";
import { colorForTag } from "./tagColors";

export function NewsBlock({ entry }: { entry: any }) {
  const imageUrl = entry.featureImage
    ? urlFor(entry.featureImage).width(840).url()
    : "/assets/news-feature.png";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-section)" }}>
      {/* Edited stamp — always before the entry */}
      {entry.editedAt && (
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(195,195,195,0.55)" }}>
          Edited on {formatDate(entry.editedAt)}
        </span>
      )}

      {/* Author(s) — one transparent plate per author */}
      <AuthorPlates entry={entry} />

      {/* Feature image — width fixed, height variable, never cropped */}
      <div style={{ width: "100%", aspectRatio: "3/2", background: "#111", borderRadius: "var(--radius-tag)", overflow: "hidden", position: "relative" }}>
        <Image
          src={imageUrl}
          alt={entry.title ?? "News feature"}
          fill
          style={{ objectFit: "contain" }}
          sizes="(max-width: 700px) 378px, 420px"
        />
      </div>

      {/* Function / Come by block — transparent, quiet grey, multi-line */}
      {entry.functionValue && (
        <Tag
          group={entry.functionLabel ?? "Come by:"}
          value={entry.functionValue}
          color="transparent"
          width="100%"
          multiline
          minHeight={80}
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

      {/* Tags — keep their group colours */}
      {(entry.tags?.length ?? 0) > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--gap-row)", marginTop: "var(--gap-divide)" }}>
          {entry.tags.map((tag: any, i: number) => (
            <Tag key={i} group={tag.group} value={tag.value} color={colorForTag(tag.value, tag.color)} valueCase={tag.group === "AUTHOR" ? undefined : "title"} />
          ))}
        </div>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
