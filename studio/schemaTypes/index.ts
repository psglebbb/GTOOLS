import { authorSchema } from "./author";
import { tagSchema } from "./tag";
import { toolSchema } from "./tool";

// One unified box type (`tool`) covers both tool and news entries; "news" is a
// big category on the box, not a separate document type.
export const schemaTypes = [
  authorSchema,
  tagSchema,
  toolSchema,
];
