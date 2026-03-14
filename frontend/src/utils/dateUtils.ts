export const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const getCurrentMonthRange = () => {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { start: formatDate(first), end: formatDate(last) };
}

export const getCurrentWeekRange = () => {
  const now = new Date();
  const day = now.getDay();
  const diff = (day === 0 ? -6 : 1) - day;

  const monday = new Date(now);
  monday.setDate(now.getDate() + diff);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { start: formatDate(monday), end: formatDate(sunday) };
}