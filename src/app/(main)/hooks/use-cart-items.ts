import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";

import useGetAxios from "./use-get-axios";
import { fetchCartItems } from "../utils/query-functions";
import { CartItem } from "../types/cart-item";

const useCartItems = () => {
  const getAxios = useGetAxios();
  const cartItemsQuery = useQuery<CartItem[], AxiosError>({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const axios = await getAxios();

      return fetchCartItems(axios);
    },
  });

  useEffect(() => {
    if (cartItemsQuery.isError) {
      console.error("Error from `useCartItems`:", cartItemsQuery.error);

      toast.error("Failed to fetch cart items");
    }
  }, [cartItemsQuery.isError, cartItemsQuery.error]);

  return {
    cartItemsQuery,
  };
};

export default useCartItems;
