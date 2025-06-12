import { AxiosInstance } from "axios";

export const fetchProducts = async (axios: AxiosInstance) => {
  try {
    const response = await axios.get("/products");

    return response.data;
  } catch (error) {
    console.error("Error from `fetchProducts`:", error);
  }
};
