const JUNK_WORDS = ["the","and","for","from","via","ref","to","at","by"];

export function handleExpenseName(row) {
  const raw = [
    row.Merchant,
    row.Description,
    row["Transaction Details"],
    row.Narration,
  ].find(
    (val) =>
      val &&
      val.trim() &&
      val.trim() !== "-" &&
      val.trim() !== "N/A"
  );

  // If no usable text found
  if (!raw) {
    const category =
      row.Category && row.Category !== "None"
        ? row.Category
        : null;

    if (category) {
      return (
        category.charAt(0).toUpperCase() +
        category.slice(1)
      );
    }

    return "Expense";
  }

  // If it's a Merchant → preserve but format nicely
  if (row.Merchant && raw === row.Merchant) {
    return raw
      .toLowerCase()
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1)
      )
      .join(" ");
  }

  // Clean messy descriptions
  const isAllCaps = raw === raw.toUpperCase();
  let base = isAllCaps ? raw.toLowerCase() : raw;

  let cleaned = base
    .toLowerCase()
    .replace(/[^a-z0-9 &-]/g, "")
    .split(" ")
    .filter(
      (word) =>
        word.length > 1 &&
        !JUNK_WORDS.includes(word)
    )
    .slice(0, 4)
    .join(" ");

  cleaned =
    cleaned.charAt(0).toUpperCase() +
    cleaned.slice(1);

  return cleaned || "Expense";
}