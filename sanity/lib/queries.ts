// All GROQ queries for GTOOLS content

// Big categories (their own documents), in column order. `id` is the slug the
// frontend filters tools on; `color` drives the category's plate + link colour.
export const CATEGORIES_QUERY = `
  *[_type == "category"] | order(order asc) {
    "id": slug.current,
    "label": title,
    color,
    "showInColumns": coalesce(showInColumns, true),
    "showInBurger": coalesce(showInBurger, true)
  }
`;

// Fetch all tool entries, newest first
export const ALL_TOOLS_QUERY = `
  *[_type == "tool"] | order(editedAt desc) {
    _id,
    title,
    slug,
    url,
    "category": category->slug.current,
    "categoryColor": category->color,
    displayMode,
    featureImage,
    "imgDims": featureImage.asset->metadata.dimensions,
    "authors": coalesce(authors[]-> { name, url }, [author-> { name, url }]),
    functionLabel,
    functionValue,
    description,
    tags[]{
      "group": coalesce(@->group->code, group),
      "value": coalesce(@->value, value),
      "color": coalesce(@->color, color)
    },
    editedAt
  }
`;

// Fetch all news entries, newest first
export const ALL_NEWS_QUERY = `
  *[_type == "newsEntry"] | order(editedAt desc) {
    _id,
    title,
    slug,
    "authors": coalesce(authors[]-> { name, url }, [author-> { name, url }]),
    featureImage,
    functionLabel,
    functionValue,
    description,
    tags[]{
      "group": coalesce(@->group->code, group),
      "value": coalesce(@->value, value),
      "color": coalesce(@->color, color)
    },
    editedAt
  }
`;

// All tools in a specific category
export const TOOLS_BY_CATEGORY_QUERY = `
  *[_type == "tool" && category->slug.current == $category] | order(editedAt desc) {
    _id,
    title,
    slug,
    url,
    "category": category->slug.current,
    "categoryColor": category->color,
    "authors": coalesce(authors[]-> { name }, [author-> { name }]),
    functionLabel,
    functionValue,
    description,
    tags[]{ "group": coalesce(@->group->code, group), "value": coalesce(@->value, value), "color": coalesce(@->color, color) },
    editedAt
  }
`;

// All authors
export const ALL_AUTHORS_QUERY = `
  *[_type == "author"] | order(name asc) {
    _id,
    name,
    slug
  }
`;

// Single tool by slug
export const TOOL_BY_SLUG_QUERY = `
  *[_type == "tool" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    url,
    "category": category->slug.current,
    "categoryColor": category->color,
    "authors": coalesce(authors[]-> { name, slug }, [author-> { name, slug }]),
    functionLabel,
    functionValue,
    description,
    tags[]{ "group": coalesce(@->group->code, group), "value": coalesce(@->value, value), "color": coalesce(@->color, color) },
    editedAt
  }
`;

// Single news entry by slug
export const NEWS_BY_SLUG_QUERY = `
  *[_type == "newsEntry" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    "authors": coalesce(authors[]-> { name, slug }, [author-> { name, slug }]),
    featureImage,
    functionLabel,
    functionValue,
    description,
    tags[]{ "group": coalesce(@->group->code, group), "value": coalesce(@->value, value), "color": coalesce(@->color, color) },
    editedAt
  }
`;
