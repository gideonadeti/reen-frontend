import { AxiosInstance } from "axios";
import { z } from "zod";

import { formSchema } from "../../components/create-product-dialog";

export const fetchProducts = async (axios: AxiosInstance) => {
  try {
    const response = await axios.get("/products");

    return response.data;
  } catch (error) {
    console.error("Error from `fetchProducts`:", error);
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
  }
};

export const deleteProduct = async (axios: AxiosInstance, id: string) => {
  try {
    const response = await axios.delete(`/products/${id}`);

    return response.data;
  } catch (error) {
    console.error("Error from `deleteProduct`:", error);
  }
};
