import { AxiosInstance } from "axios";
import { UserRole } from "../types/user";

export const fetchCartItems = async (axios: AxiosInstance) => {
  try {
    const response = await axios.get("/cart-items");

    return response.data;
  } catch (error) {
    console.error("Error from `fetchCartItems`:", error);

    throw error;
  }
};

interface CreateCartItemFormValues {
  productId: string;
  quantity: number;
}

export const createCartItem = async (
  axios: AxiosInstance,
  { productId, quantity }: CreateCartItemFormValues
) => {
  try {
    const response = await axios.post("/cart-items", {
      productId,
      quantity,
    });

    return response.data;
  } catch (error) {
    console.error("Error from `createCartItem`:", error);

    throw error;
  }
};

export const updateCartItem = async (
  axios: AxiosInstance,
  id: string,
  { productId, quantity }: CreateCartItemFormValues
) => {
  try {
    const response = await axios.patch(`/cart-items/${id}`, {
      productId,
      quantity,
    });

    return response.data;
  } catch (error) {
    console.error("Error from `updateCartItem`:", error);

    throw error;
  }
};

export const deleteCartItem = async (axios: AxiosInstance, id: string) => {
  try {
    const response = await axios.delete(`/cart-items/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error from `deleteCartItem`:", error);

    throw error;
  }
};

export const fetchUser = async (axios: AxiosInstance, clerkId: string) => {
  try {
    const response = await axios.get(`auth/users/${clerkId}`);

    return response.data;
  } catch (error) {
    console.error("Error from `fetchUser`:", error);

    throw error;
  }
};

export const updateUserRole = async (axios: AxiosInstance, role: UserRole) => {
  try {
    const response = await axios.post("auth/update-user-role", { role });

    return response.data;
  } catch (error) {
    console.error("Error from `updateUserRole`:", error);

    throw error;
  }
};

export const checkout = async (axios: AxiosInstance) => {
  try {
    const response = await axios.post("/checkout");

    return response.data;
  } catch (error) {
    console.error("Error from `checkout`:", error);

    throw error;
  }
};
