import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { z } from "zod";

import useGetAxios from "./use-get-axios";
import useProducts from "../products/hooks/use-products";
import { CartItem } from "../types/cart-item";
import { createCartItemFormSchema } from "../products/[productId]/components/create-cart-item-dialog";
import { Product } from "../products/types/product";
import {
  createCartItem,
  deleteCartItem,
  fetchCartItems,
  updateCartItem,
} from "../utils/query-functions";

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

  const updateCartItemMutation = useMutation<
    CartItem,
    AxiosError,
    {
      id: string;
      productId: string;
      formValues: z.infer<typeof createCartItemFormSchema>;
      closeCreateCartItemDialog: () => void;
    }
  >({
    mutationFn: async ({ id, productId, formValues: { quantity } }) => {
      const axios = await getAxios();

      return updateCartItem(axios, id, { productId, quantity });
    },
    onError: (error) => {
      const description =
        (error?.response?.data as { message: string })?.message ||
        "Something went wrong";

      toast.error(description);
    },
    onSuccess: (updatedCartItem, { closeCreateCartItemDialog }) => {
      closeCreateCartItemDialog();

      toast.success("Cart item updated successfully");

      queryClient.setQueryData<CartItem[]>(["cart-items"], (oldCartItems) => {
        return oldCartItems?.map((cartItem) => {
          if (cartItem.id === updatedCartItem.id) {
            return {
              ...cartItem,
              ...updatedCartItem,
            };
          }

          return cartItem;
        });
      });
    },
  });

  const deleteCartItemMutation = useMutation<
    CartItem,
    AxiosError,
    {
      id: string;
      onOpenChange: (open: boolean) => void;
    }
  >({
    mutationFn: async ({ id }) => {
      const axios = await getAxios();

      return deleteCartItem(axios, id);
    },
    onError: (error) => {
      const description =
        (error?.response?.data as { message: string })?.message ||
        "Something went wrong";

      toast.error(description);
    },
    onSuccess: (_, { id, onOpenChange }) => {
      onOpenChange(false);

      toast.success("Cart item deleted successfully");

      queryClient.setQueryData<CartItem[]>(["cart-items"], (oldCartItems) => {
        return oldCartItems?.filter((cartItem) => cartItem.id !== id);
      });
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
    updateCartItemMutation,
    deleteCartItemMutation,
  };
};

export default useCartItems;
