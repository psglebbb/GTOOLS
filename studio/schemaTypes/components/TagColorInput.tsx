import { useCallback, useEffect, useRef, useState } from "react";
import {
  set,
  unset,
  useClient,
  useFormValue,
  type StringInputProps,
} from "sanity";
import { Button, Flex, TextInput } from "@sanity/ui";
import { generateTone } from "../tagColor";

// Custom input for a tag's `color`. It reads the sibling `group` reference,
// fetches that group's base hue, and fills a WCAG-checked tone in — automatically
// the first time a group is picked (when the field is still empty), and on demand
// via the ↺ button. The value stays a plain, hand-editable hex string.
export function TagColorInput(props: StringInputProps) {
  const { value = "", onChange, elementProps } = props;
  const client = useClient({ apiVersion: "2021-06-07" });
  const groupRef = useFormValue(["group", "_ref"]) as string | undefined;
  const [busy, setBusy] = useState(false);
  const autofilledFor = useRef<string | undefined>(undefined);

  const generate = useCallback(
    async (jitter: boolean) => {
      if (!groupRef) return;
      setBusy(true);
      try {
        const group = await client.fetch(
          `*[_id == $id][0]{ baseHue, baseSat, baseLightness }`,
          { id: groupRef },
        );
        if (group?.baseHue == null) return;
        const hex = generateTone(
          {
            hue: group.baseHue,
            sat: group.baseSat,
            lightness: group.baseLightness,
          },
          jitter,
        );
        onChange(set(hex));
      } finally {
        setBusy(false);
      }
    },
    [client, groupRef, onChange],
  );

  // Auto-fill once when a group is first chosen and no colour has been set yet.
  // Never clobbers an existing (possibly hand-tweaked) colour.
  useEffect(() => {
    if (groupRef && !value && autofilledFor.current !== groupRef) {
      autofilledFor.current = groupRef;
      void generate(false);
    }
  }, [groupRef, value, generate]);

  return (
    <Flex gap={2} align="center">
      <span
        aria-hidden
        style={{
          width: 28,
          height: 28,
          flex: "none",
          borderRadius: 4,
          border: "1px solid var(--card-border-color, #444)",
          background: value || "transparent",
        }}
      />
      <TextInput
        {...elementProps}
        style={{ flex: 1 }}
        value={value}
        placeholder="#rrggbb"
        onChange={(e) =>
          onChange(
            e.currentTarget.value ? set(e.currentTarget.value) : unset(),
          )
        }
      />
      <Button
        mode="ghost"
        text="↺"
        title="Regenerate colour from this group"
        disabled={!groupRef || busy}
        onClick={() => void generate(true)}
      />
    </Flex>
  );
}
