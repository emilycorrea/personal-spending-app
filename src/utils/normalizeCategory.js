export function normalizeCategory(rawCategory) {
  const category = rawCategory?.toLowerCase();

  if (!category) return "other";

  if (
    category.includes("food") ||
    category.includes("dining") ||
    category.includes("restaurant") ||
    category.includes("grocer") ||
    category.includes("supermarket")
  ) {
    return "food";
  }

  if (
    category.includes("transport") ||
    category.includes("fuel") ||
    category.includes("travel") ||
    category.includes("rideshare") ||
    category.includes("gas")
  ) {
    return "travel";
  }

  if (
    category.includes("shop") ||
    category.includes("shopping") ||
    category.includes("retail")
  ) {
    return "shopping";
  }

  if (
    category.includes("subscription") ||
    category.includes("beauty") ||
    category.includes("personal") ||
    category.includes("care")
  ) {
    return "personal";
  }

  if (
    category.includes("entertainment") ||
    category.includes("leisure") ||
    category.includes("movie") ||
    category.includes("music") ||
    category.includes("game")
  ) {
    return "entertainment";
  }

  if (
    category.includes("utility") ||
    category.includes("bill") ||
    category.includes("rent") ||
    category.includes("phone") ||
    category.includes("internet")
  ) {
    return "bills & utilities";
  }

  return "other";
}