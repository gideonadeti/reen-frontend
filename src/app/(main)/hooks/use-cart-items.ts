import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { z } from "zod";

import useGetAxios from "./use-get-axios";
import useProducts from "../products/hooks/use-products";
import { createCartItem, fetchCartItems } from "../utils/query-functions";
import { CartItem } from "../types/cart-item";
import { createCartItemFormSchema } from "../products/[productId]/components/create-cart-item-dialog";
import { Product } from "../products/types/product";

const useCartItems = () => {
  const getAxios = useGetAxios();
  const { productsQuery } = useProducts();
  const queryClient = useQueryClient();
  const products = productsQuery.data || [];
  const cartItemsQuery = useQuery<CartItem[], AxiosError>({
    queryKey: ["cart-items"],
    queryFn: async () => {
      const axios = await getAxios();

      return fetchCartItems(axios);
    },
  });

  const createCartItemMutation = useMutation<
    CartItem,
    AxiosError,
    {
      productId: string;
      formValues: z.infer<typeof createCartItemFormSchema>;
      closeCreateCartItemDialog: () => void;
      setOpenCartItemsSheet: (openCartItemsSheet: boolean) => void;
    }
  >({
    mutationFn: async ({ productId, formValues: { quantity } }) => {
      const axios = await getAxios();

      return createCartItem(axios, { productId, quantity });
    },
    onError: (error) => {
      const description =
        (error?.response?.data as { message: string })?.message ||
        "Something went wrong";

      toast.error(description);
    },
    onSuccess: (
      newCartItem,
      { closeCreateCartItemDialog, productId, setOpenCartItemsSheet }
    ) => {
      closeCreateCartItemDialog();

      toast.success("Cart item created successfully");

      const product = products.find(
        (product) => product.id === productId
      ) as Product;

      queryClient.setQueryData<CartItem[]>(["cart-items"], (oldCartItems) => {
        return [
          ...(oldCartItems || []),
          {
            ...newCartItem,
            product,
          },
        ];
      });

      setOpenCartItemsSheet(true);
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
    createCartItemMutation,
  };
};

export default useCartItems;
