import Image from "next/image";
import { urlFor } from "@/sanity/lib/client";
import { Tag } from "./Tag";

export function NewsBlock({ entry }: { entry: any }) {
  const imageUrl = entry.featureImage
    ? urlFor(entry.featureImage).width(756).url()
    : "/assets/news-feature.png";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--gap-column)" }}>
      {/* Author */}
      <Tag group="Author:" value={entry.author?.name ?? "—"} color="var(--surface)" width="100%" />

      {/* Feature image */}
      <div style={{ width: "100%", aspectRatio: "3/2", background: "#111", borderRadius: "var(--radius-card)", overflow: "hidden", position: "relative" }}>
        <Image
          src={imageUrl}
          alt={entry.title ?? "News feature"}
          fill
          style={{ objectFit: "contain" }}
          sizes="378px"
        />
      </div>

      {/* Function / Come by block */}
      {entry.functionValue && (
        <Tag
          group={entry.functionLabel ?? "Come by:"}
          value={entry.functionValue}
          color="var(--surface)"
          width="100%"
          multiline
          minHeight={80}
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {entry.tags.map((tag: any, i: number) => (
            <Tag key={i} group={tag.group} value={tag.value} color={tag.color ?? "var(--tag-access-base)"} />
          ))}
        </div>
      )}

      {/* Edited stamp */}
      {entry.editedAt && (
        <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 9, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(195,195,195,0.55)" }}>
          Edited on {formatDate(entry.editedAt)}
        </span>
      )}
    </div>
  );
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}
