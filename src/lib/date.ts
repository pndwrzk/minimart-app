
export const formatDateTimeID = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  return date.toLocaleString("id-ID", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};
