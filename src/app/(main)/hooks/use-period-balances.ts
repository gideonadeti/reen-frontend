import { useMemo } from "react";
import { isSameDay, isSameMonth, isSameYear } from "date-fns";

import useUsers from "../users/hooks/use-users";
import { PeriodType } from "../profile/types/period-type";

const usePeriodBalances = (
  userId: string | undefined,
  periodDate: Date,
  periodType: PeriodType
) => {
  const { usersQuery } = useUsers();
  const users = usersQuery.data || [];
  const user = users.find((user) => user.id === userId);

  const periodBalances = useMemo(() => {
    if (usersQuery.isPending || !user) {
      return [];
    }

    const balances = user?.balances || [];

    switch (periodType) {
      case "day":
        return balances.filter((balance) => {
          const balanceDate = new Date(balance.createdAt);

          return isSameDay(balanceDate, periodDate);
        });
      case "month":
        return balances.filter((balance) => {
          const balanceDate = new Date(balance.createdAt);

          return isSameMonth(balanceDate, periodDate);
        });
      case "year":
        return balances.filter((balance) => {
          const balanceDate = new Date(balance.createdAt);

          return isSameYear(balanceDate, periodDate);
        });
      default:
        return [];
    }
  }, [periodDate, periodType, user, usersQuery.isPending]);

  return periodBalances;
};

export default usePeriodBalances;
