// All GROQ queries for GTOOLS content

// Fetch all tool entries, newest first
export const ALL_TOOLS_QUERY = `
  *[_type == "tool"] | order(editedAt desc) {
    _id,
    title,
    slug,
    url,
    category,
    displayMode,
    featureImage,
    "authors": coalesce(authors[]-> { name }, [author-> { name }]),
    functionLabel,
    functionValue,
    description,
    tags[] {
      group,
      value,
      color
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
    "authors": coalesce(authors[]-> { name }, [author-> { name }]),
    featureImage,
    functionLabel,
    functionValue,
    description,
    tags[] {
      group,
      value,
      color
    },
    editedAt
  }
`;

// All tools in a specific category
export const TOOLS_BY_CATEGORY_QUERY = `
  *[_type == "tool" && category == $category] | order(editedAt desc) {
    _id,
    title,
    slug,
    url,
    category,
    "authors": coalesce(authors[]-> { name }, [author-> { name }]),
    functionLabel,
    functionValue,
    description,
    tags[] { group, value, color },
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
    category,
    "authors": coalesce(authors[]-> { name, slug }, [author-> { name, slug }]),
    functionLabel,
    functionValue,
    description,
    tags[] { group, value, color },
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
    tags[] { group, value, color },
    editedAt
  }
`;
