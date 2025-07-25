export function totalDaysInMonth(month: number, year: number) {
  // month is 1-indexed (1 for January, 2 for February, ..., 12 for December)
  if (month < 1 || month > 12) {
    throw new Error("Month must be between 1 and 12");
  }

  // Use Date object to calculate the last day of the given month
  return new Date(year, month, 0).getDate();
}
