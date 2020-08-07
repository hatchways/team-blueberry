//For time calculation
const timeMap = {
  minute: 60000,
  hour: 3600000,
  day: 86400000,
  week: 604800000,
  month: 2592000000,
  year: 31536000000,
};

//Transform date to 'ago' format
export default function calcDate(date) {
  const created = new Date(date);
  const now = Date.now();
  const timeDelta = now - created.valueOf();
  let elapsed = 0;
  if (timeDelta < timeMap.minute) {
    return "just now";
  } else if (timeDelta < timeMap.hour) {
    elapsed = timeDelta / timeMap.minute;
    elapsed = Math.floor(elapsed);
    return `${elapsed} minute(s) ago`;
  } else if (timeDelta < timeMap.day) {
    elapsed = timeDelta / timeMap.hour;
    elapsed = Math.floor(elapsed);
    return `${elapsed} hour(s) ago`;
  } else if (timeDelta < timeMap.week) {
    elapsed = timeDelta / timeMap.day;
    elapsed = Math.floor(elapsed);
    return `${elapsed} day(s) ago`;
  } else if (timeDelta < timeMap.month) {
    elapsed = timeDelta / timeMap.week;
    elapsed = Math.floor(elapsed);
    return `${elapsed} week(s) ago`;
  } else if (timeDelta < timeMap.year) {
    elapsed = timeDelta / timeMap.month;
    elapsed = Math.floor(elapsed);
    return `${elapsed} month(s) ago`;
  } else {
    return "over a year ago";
  }
}
