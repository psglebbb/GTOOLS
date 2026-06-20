import { authorSchema } from "./author";
import { categorySchema } from "./category";
import { tagSchema } from "./tag";
import { toolSchema } from "./tool";

// One unified box type (`tool`) covers both tool and news entries; "news" is a
// big category on the box, not a separate document type. Big categories are
// their own `category` documents so they can be added/edited in the Studio.
export const schemaTypes = [
  authorSchema,
  categorySchema,
  tagSchema,
  toolSchema,
];
