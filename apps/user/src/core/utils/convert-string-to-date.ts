export const convertTime = (dateString: string): string => {
  const [day, month, year] = dateString.split('.').map(Number);
  const date = new Date(year, month - 1, day);
  const dateTime = date.toISOString();
  return dateTime;
};
