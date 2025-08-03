import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";

import useGetAxios from "../../hooks/use-get-axios";
import { fetchOrders } from "../utils/query-functions";
import { Order } from "../types/order";

const useOrders = () => {
  const getAxios = useGetAxios();
  const ordersQuery = useQuery<Order[], AxiosError>({
    queryKey: ["orders"],
    queryFn: async () => {
      const axios = await getAxios();

      return fetchOrders(axios);
    },
  });

  useEffect(() => {
    if (ordersQuery.isError) {
      console.error("Error from `useOrders`:", ordersQuery.error);

      toast.error("Failed to fetch orders", {
        id: "fetch-orders-error",
      });
    }
  }, [ordersQuery.isError, ordersQuery.error]);

  return {
    ordersQuery,
  };
};

export default useOrders;
