/**
 * Convert to URL format (remove spaces)
 * "men's clothing" -> "mens-clothing"
 */
export function toUrlFormat(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, "-"); // Replace spaces with hyphens
  // .replace(/[^a-z0-9-]/g, ""); // Remove special characters
}

/**
 * Convert from URL format (restore spaces)
 * "mens-clothing" -> "men's clothing"
 */
export function fromUrlFormat(text: string): string {
  return text.replace(/-/g, " ");
}

/**
 * Create URL-safe category name
 */
export function createCategoryUrl(category: string): string {
  return `/products/category/${toUrlFormat(category)}`;
}

/**
 * Get original text from URL param
 */
export function getCategoryFromUrl(urlParam: string | null): string {
  if (!urlParam) return "";
  return fromUrlFormat(urlParam);
}
