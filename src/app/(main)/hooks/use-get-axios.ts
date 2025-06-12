import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";

const useGetAxios = () => {
  const { getToken } = useAuth();

  return useMemo(() => {
    return async () => {
      const token = await getToken();

      return axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    };
  }, [getToken]);
};

export default useGetAxios;
