import { AxiosInstance } from "axios";
import { z } from "zod";

import { formSchema } from "../../components/create-product-dialog";

export const fetchProducts = async (axios: AxiosInstance) => {
  try {
    const response = await axios.get("/products");

    return response.data;
  } catch (error) {
    console.error("Error from `fetchProducts`:", error);

    throw error;
  }
};

export const createProduct = async (
  axios: AxiosInstance,
  formValues: z.infer<typeof formSchema>
) => {
  try {
    const response = await axios.post("/products", formValues);

    return response.data;
  } catch (error) {
    console.error("Error from `createProduct`:", error);

    throw error;
  }
};

export const deleteProduct = async (axios: AxiosInstance, id: string) => {
  try {
    const response = await axios.delete(`/products/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error from `deleteProduct`:", error);

    throw error;
  }
};

export const updateProduct = async (
  axios: AxiosInstance,
  id: string,
  formValues: z.infer<typeof formSchema>
) => {
  try {
    const response = await axios.patch(`/products/${id}`, formValues);

    return response.data;
  } catch (error) {
    console.error("Error from `updateProduct`:", error);

    throw error;
  }
};
