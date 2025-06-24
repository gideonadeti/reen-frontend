import { format } from "date-fns";

import { PeriodType } from "../types/period-type";

const formatDate = (periodType: PeriodType, periodDate: Date) => {
  switch (periodType) {
    case "day":
      return format(periodDate, "MMM dd, yyyy");
    case "month":
      return format(periodDate, "MMMM yyyy");
    case "year":
      return format(periodDate, "yyyy");
  }
};

export default formatDate;
