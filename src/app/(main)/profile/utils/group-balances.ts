import { format, getHours, getDate, getMonth, getDaysInMonth } from "date-fns";

import { Balance } from "../../types/user";

// Function to convert day numbers to ordinal strings
const formatOrdinal = (day: number) => {
  const suffix = ["th", "st", "nd", "rd"];
  const value = day % 100;

  return `${day}${suffix[(value - 20) % 10] || suffix[value] || suffix[0]}`;
};

// Function to group balances by hour for "Day" view
export const groupBalancesByHour = (
  periodBalances: Balance[],
  periodDate: Date
) => {
  const hourlyBalances = Array.from({ length: 24 }, (_, hour) => {
    const hourDate = new Date(periodDate);

    hourDate.setHours(hour, 0, 0, 0);

    return {
      hour: format(hourDate, "hh:mm a"),
      amount: 0,
    };
  });

  periodBalances.forEach((balance) => {
    const balanceDate = new Date(balance.createdAt);
    const hour = getHours(balanceDate);

    hourlyBalances[hour].amount += Number(balance.amount);
  });

  return hourlyBalances;
};

// Function to group balances by day for "Month" view
export const groupBalancesByDay = (
  periodBalances: Balance[],
  periodDate: Date
) => {
  const daysInMonth = getDaysInMonth(periodDate);

  // Create an array of objects with ordinal dates for each day
  const dailyBalances = Array.from({ length: daysInMonth }, (_, dayIndex) => {
    const day = dayIndex + 1;

    return {
      day: formatOrdinal(day), // Convert day to "1st", "2nd", etc.
      amount: 0,
    };
  });

  periodBalances.forEach((balance) => {
    const balanceDate = new Date(balance.createdAt);
    const dayIndex = getDate(balanceDate) - 1; // Map day to array index

    dailyBalances[dayIndex].amount += Number(balance.amount);
  });

  return dailyBalances;
};

// Function to group balances by month for "Year" view
export const groupBalancesByMonth = (
  periodBalances: Balance[],
  periodDate: Date
) => {
  const monthlyBalances = Array.from({ length: 12 }, (_, monthIndex) => ({
    month: format(new Date(periodDate.getFullYear(), monthIndex), "MMM"),
    amount: 0,
  }));

  periodBalances.forEach((balance) => {
    const balanceDate = new Date(balance.createdAt);
    const month = getMonth(balanceDate);

    monthlyBalances[month].amount += Number(balance.amount);
  });

  return monthlyBalances;
};
