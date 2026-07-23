import { authorSchema } from "./author";
import { categorySchema } from "./category";
import { tagGroupSchema } from "./tagGroup";
import { tagSchema } from "./tag";
import { toolSchema } from "./tool";
import { siteSettingsSchema } from "./siteSettings";

// One unified box type (`tool`) covers both tool and news entries; "news" is a
// big category on the box, not a separate document type. Big categories are
// their own `category` documents so they can be added/edited in the Studio.
// Tags are shared `tag` documents grouped by `tagGroup` documents (both self-serve
// in the Studio); a box references tags rather than re-typing them inline.
export const schemaTypes = [
  authorSchema,
  categorySchema,
  tagGroupSchema,
  tagSchema,
  toolSchema,
  siteSettingsSchema,
];
