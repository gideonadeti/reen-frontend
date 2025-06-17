import {
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
  isThisWeek,
  isThisYear,
} from "date-fns";

const formatDate = (date: Date) => {
  if (isToday(date)) {
    const absolute = format(date, "p");
    const relative = formatDistanceToNow(date, { addSuffix: true });

    return `Today at ${absolute} (${relative})`;
  } else if (isYesterday(date)) {
    return `Yesterday at ${format(date, "p")}`;
  } else if (isThisWeek(date)) {
    return `${format(date, "EEEE")} at ${format(date, "p")}`;
  } else if (isThisYear(date)) {
    return `${format(date, "MMM d")} at ${format(date, "p")}`;
  } else {
    return `${format(date, "MMM d, yyyy")} at ${format(date, "p")}`;
  }
};

export default formatDate;
