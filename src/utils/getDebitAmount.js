export function getDebitAmount(row) {
  const raw =
    row["Debit Amount"] ||
    row["Debit"] ||
    row["Amount"] ||
    row["debit_amount"] ||
    row["DEBIT"] ||
    "0";

  const amount = Number(raw.toString().replace(/[^0-9.]/g, "")); // strip $ or commas
  return isNaN(amount) ? 0 : amount;
}
