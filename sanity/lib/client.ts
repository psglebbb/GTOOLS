import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01",
  useCdn: true, // fast reads; set false for always-fresh data
});

// Helper for building image URLs from Sanity image references
const builder = imageUrlBuilder(client);
export function urlFor(source: any) {
  return builder.image(source);
}

// Typed fetch helper
export async function sanityFetch<T>(query: string, params = {}): Promise<T> {
  return client.fetch<T>(query, params);
}
