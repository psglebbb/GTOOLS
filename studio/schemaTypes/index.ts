import { authorSchema } from "./author";
import { tagSchema } from "./tag";
import { toolSchema } from "./tool";
import { newsEntrySchema } from "./newsEntry";

export const schemaTypes = [
  authorSchema,
  tagSchema,
  toolSchema,
  newsEntrySchema,
];