import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { z } from "zod";
import { useUser as clerkUseUser } from "@clerk/nextjs";

import useGetAxios from "../../hooks/use-get-axios";
import useUser from "../../hooks/use-user";
import { User } from "../../types/user";
import { Product } from "../types/product";
import { createProductFormSchema } from "../../components/create-product-dialog";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
} from "../utils/query-functions";

const useProducts = () => {
  const { user: clerkUser } = clerkUseUser();
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
      formValues: z.infer<typeof createProductFormSchema>;
      fee: number;
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
    onSuccess: (newProduct, { closeCreateProductDialog, fee }) => {
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

      queryClient.setQueryData<User>(["users", clerkUser?.id], (oldUser) => {
        if (!oldUser) return undefined;

        return {
          ...oldUser,
          balance: (oldUser.balance || 0) - fee,
          amountSpent: (oldUser.amountSpent || 0) + fee,
        };
      });

      queryClient.setQueryData<User[]>(["users"], (oldUsers) => {
        return oldUsers?.map((oldUser) => {
          if (oldUser.id === user?.id) {
            return {
              ...oldUser,
              balance: (oldUser.balance || 0) - fee,
              amountSpent: (oldUser.amountSpent || 0) + fee,
            };
          }
          return oldUser;
        });
      });
    },
  });

  const updateProductMutation = useMutation<
    Product,
    AxiosError,
    {
      formValues: z.infer<typeof createProductFormSchema>;
      fee: number;
      id: string;
      closeCreateProductDialog: () => void;
    }
  >({
    mutationFn: async ({ formValues, id }) => {
      const axios = await getAxios();

      return updateProduct(axios, id, formValues);
    },
    onError: (error) => {
      const description =
        (error?.response?.data as { message: string })?.message ||
        "Something went wrong";

      toast.error(description);
    },
    onSuccess: (updatedProduct, { closeCreateProductDialog, fee }) => {
      closeCreateProductDialog();

      toast.success("Product updated successfully");

      queryClient.setQueryData<Product[]>(["products"], (oldProducts) => {
        return oldProducts?.map((product) => {
          if (product.id === updatedProduct.id) {
            return {
              ...product,
              ...updatedProduct,
            };
          }
          return product;
        });
      });

      queryClient.setQueryData<User>(["users", clerkUser?.id], (oldUser) => {
        if (!oldUser) return undefined;

        return {
          ...oldUser,
          balance: (oldUser.balance || 0) - fee,
          amountSpent: (oldUser.amountSpent || 0) + fee,
        };
      });

      queryClient.setQueryData<User[]>(["users"], (oldUsers) => {
        return oldUsers?.map((oldUser) => {
          if (oldUser.id === user?.id) {
            return {
              ...oldUser,
              balance: (oldUser.balance || 0) - fee,
              amountSpent: (oldUser.amountSpent || 0) + fee,
            };
          }
          return oldUser;
        });
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

      toast.error("Failed to fetch products", {
        id: "fetch-products-error",
      });
    }
  }, [productsQuery.isError, productsQuery.error]);

  return {
    productsQuery,
    createProductMutation,
    updateProductMutation,
    deleteProductMutation,
  };
};

export default useProducts;
