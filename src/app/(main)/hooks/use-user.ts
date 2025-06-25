import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect, useMemo } from "react";
import { isSameDay, isSameMonth, isSameYear } from "date-fns";

import useGetAxios from "./use-get-axios";
import { fetchUser, updateUserRole } from "../utils/query-functions";
import { useUser as clerkUseUser } from "@clerk/nextjs";
import { User, UserRole } from "../types/user";
import { PeriodType } from "../profile/types/period-type";

const useUser = (periodDate?: Date, periodType?: PeriodType) => {
  const { user } = clerkUseUser();
  const getAxios = useGetAxios();
  const queryClient = useQueryClient();
  const userQuery = useQuery<User, AxiosError>({
    queryKey: ["users", user?.id],
    queryFn: async () => {
      const axios = await getAxios();

      return fetchUser(axios, user?.id as string);
    },
  });

  const periodBalances = useMemo(() => {
    if (userQuery.isPending || !periodDate || !periodType) {
      return [];
    }

    const user = userQuery.data;
    const balances = user?.balances || [];

    if (!user) {
      return [];
    }

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
  }, [userQuery.isPending, userQuery.data, periodDate, periodType]);

  const updateUserRoleMutation = useMutation<
    User,
    AxiosError,
    {
      role: UserRole;
      onOpenChange: (open: boolean) => void;
      setConfirmationText: (confirmationText: string) => void;
    }
  >({
    mutationFn: async ({ role }) => {
      const axios = await getAxios();

      return updateUserRole(axios, role);
    },
    onError: (error) => {
      const description =
        (error?.response?.data as { message: string })?.message ||
        "Something went wrong";

      toast.error(description);
    },
    onSuccess: (updatedUser, { onOpenChange, setConfirmationText }) => {
      setConfirmationText("");
      onOpenChange(false);

      toast.success("Your role has been updated successfully");

      queryClient.setQueryData<User[]>(["users"], (oldUsers) => {
        return oldUsers?.map((user) => {
          if (user.id === updatedUser.id) {
            return {
              ...user,
              ...updatedUser,
            };
          }

          return user;
        });
      });

      queryClient.setQueryData<User>(["users", user?.id], () => {
        return updatedUser;
      });
    },
  });

  useEffect(() => {
    if (userQuery.isError) {
      console.error("Error from `useUser`:", userQuery.error);

      toast.error(`Failed to fetch user`);
    }
  }, [userQuery.isError, userQuery.error, user?.id]);

  return {
    userQuery,
    updateUserRoleMutation,
    periodBalances,
  };
};

export default useUser;
