// utils/formatDateToIST.js

export const formatDateToIST = (utcDate, format = "en-GB") => {
  if (!utcDate) return null;

  try {
    return new Intl.DateTimeFormat(format, {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(new Date(utcDate));
  } catch (err) {
    console.error("Invalid date passed to formatDateToIST:", utcDate);
    return null;
  }
};
