import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { z } from "zod";

import useGetAxios from "../../hooks/use-get-axios";
import useUser from "../../hooks/use-user";
import { Product } from "../types/product";
import { formSchema } from "../../components/create-product-dialog";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
} from "../utils/query-functions";

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

  const deleteProductMutation = useMutation<
    Product,
    AxiosError,
    {
      id: string;
      onOpenChange: (open: boolean) => void;
    }
  >({
    mutationFn: async ({ id }) => {
      const axios = await getAxios();

      return deleteProduct(axios, id);
    },
    onError: (error) => {
      const description =
        (error?.response?.data as { message: string })?.message ||
        "Something went wrong";

      toast.error(description);
    },
    onSuccess: (_, { id, onOpenChange }) => {
      onOpenChange(false);

      toast.success("Product deleted successfully");

      queryClient.setQueryData<Product[]>(["products"], (oldProducts) => {
        return oldProducts?.filter((product) => product.id !== id);
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
    deleteProductMutation,
  };
};

export default useProducts;
