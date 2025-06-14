import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { z } from "zod";

import useGetAxios from "../../hooks/use-get-axios";
import useUser from "../../hooks/use-user";
import { createProduct, fetchProducts } from "../utils/query-functions";
import { Product } from "../types/product";
import { formSchema } from "../../components/create-product-dialog";

const useProducts = () => {
  const { userQuery } = useUser();
  const user = userQuery.data;
  const getAxios = useGetAxios();
  const queryClient = useQueryClient();
  const productsQuery = useQuery<Product[], AxiosError>({
    queryKey: ["products"],
    queryFn: async () => {
      const axios = await getAxios();

      return fetchProducts(axios);
    },
  });

  const createProductMutation = useMutation<
    Product,
    AxiosError,
    {
      formValues: z.infer<typeof formSchema>;
      closeCreateProductDialog: () => void;
    }
  >({
    mutationFn: async ({ formValues }) => {
      const axios = await getAxios();

      return createProduct(axios, formValues);
    },
    onError: (error) => {
      const description =
        (error?.response?.data as { message: string })?.message ||
        "Something went wrong";

      toast.error(description);
    },
    onSuccess: (newProduct, { closeCreateProductDialog }) => {
      closeCreateProductDialog();

      toast.success("Product created successfully");

      queryClient.setQueryData<Product[]>(["products"], (oldProducts) => {
        return [
          {
            ...newProduct,
            admin: {
              id: user?.id as string,
              name: user?.name as string,
            },
          },
          ...(oldProducts || []),
        ];
      });
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
    createProductMutation,
  };
};

export default useProducts;
