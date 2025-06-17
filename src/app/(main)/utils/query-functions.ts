import { AxiosInstance } from "axios";
import { UserRole } from "../types/user";

export const fetchCartItems = async (axios: AxiosInstance) => {
  try {
    const response = await axios.get("/cart-items");

    return response.data;
  } catch (error) {
    console.error("Error from `fetchCartItems`:", error);
  }
};

interface createCartItemFormValues {
  productId: string;
  quantity: number;
}

export const createCartItem = async (
  axios: AxiosInstance,
  { productId, quantity }: createCartItemFormValues
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

export const fetchUser = async (axios: AxiosInstance, clerkId: string) => {
  try {
    const response = await axios.get(`auth/users/${clerkId}`);

    return response.data;
  } catch (error) {
    console.error("Error from `fetchUser`:", error);
  }
};

export const updateUserRole = async (axios: AxiosInstance, role: UserRole) => {
  try {
    const response = await axios.post("auth/update-user-role", { role });

    return response.data;
  } catch (error) {
    console.error("Error from `updateUserRole`:", error);
  }
};
