export function normalizeDate(rawDate) {
  if (!rawDate) return "";

  const trimmed = rawDate.trim();

  // already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    return trimmed;
  }

  // MM/DD/YYYY or M/D/YYYY
  const parts = trimmed.split("/");
  if (parts.length !== 3) return "";

  let [month, day, year] = parts;
  if (!day || !month || !year) return "";

  if (year.length === 2) year = `20${year}`;

  day = day.padStart(2, "0");
  month = month.padStart(2, "0");

  return `${year}-${month}-${day}`;
}