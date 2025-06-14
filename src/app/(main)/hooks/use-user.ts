import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";

import useGetAxios from "./use-get-axios";
import { fetchUser } from "../utils/query-functions";
import { useUser as clerkUseUser } from "@clerk/nextjs";
import { User } from "../types/user";

const useUser = () => {
  const { user } = clerkUseUser();
  const getAxios = useGetAxios();
  const userQuery = useQuery<User, AxiosError>({
    queryKey: ["users", user?.id],
    queryFn: async () => {
      const axios = await getAxios();

      return fetchUser(axios, user?.id as string);
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
  };
};

export default useUser;
