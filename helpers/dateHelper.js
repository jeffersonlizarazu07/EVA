const getDateTimeForSQL = (timeZone = "America/Bogota") => {
    const date = new Date();
 
    const options = {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
 
    const formatter = new Intl.DateTimeFormat("en-CA", options);
    const parts = formatter.formatToParts(date);
 
    const get = (type) => parts.find(p => p.type === type)?.value.padStart(2, "0");
 
    const formatted = `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
 
    return formatted;
  }
 
  module.exports = { getDateTimeForSQL };
 