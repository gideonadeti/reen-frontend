import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";

import useGetAxios from "../../hooks/use-get-axios";
import { fetchUsers } from "../utils/query-functions";
import { User } from "../../types/user";

const useUsers = () => {
  const getAxios = useGetAxios();
  const usersQuery = useQuery<User[], AxiosError>({
    queryKey: ["users"],
    queryFn: async () => {
      const axios = await getAxios();

      return fetchUsers(axios);
    },
  });

  useEffect(() => {
    if (usersQuery.isError) {
      toast.error(`Failed to fetch users`);
    }
  }, [usersQuery.isError]);

  return {
    usersQuery,
  };
};

export default useUsers;
