import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";

import useGetAxios from "./use-get-axios";
import { fetchUser, updateUserRole } from "../utils/query-functions";
import { useUser as clerkUseUser } from "@clerk/nextjs";
import { User, UserRole } from "../types/user";

const useUser = () => {
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
  };
};

export default useUser;
