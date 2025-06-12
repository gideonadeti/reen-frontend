import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";

import useGetAxios from "../../hooks/use-get-axios";
import { fetchProducts } from "../utils/query-functions";
import { Product } from "../types/product";

const useProducts = () => {
  const getAxios = useGetAxios();
  const productsQuery = useQuery<Product[], AxiosError>({
    queryKey: ["products"],
    queryFn: async () => {
      const axios = await getAxios();

      return fetchProducts(axios);
    },
  });

  useEffect(() => {
    if (productsQuery.isError) {
      console.error("Error from `useProducts`:", productsQuery.error);

      toast.error("Failed to fetch products");
    }
  }, [productsQuery.isError, productsQuery.error]);

  return {
    productsQuery,
  };
};

export default useProducts;
