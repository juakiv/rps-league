export function getDatesRange(startDate: Date, endDate: Date) {
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  return { start: start.getTime(), end: end.getTime() };
}