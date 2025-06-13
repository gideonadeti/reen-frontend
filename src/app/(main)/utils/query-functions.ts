import { AxiosInstance } from "axios";

export const fetchCartItems = async (axios: AxiosInstance) => {
  try {
    const response = await axios.get("/cart-items");

    return response.data;
  } catch (error) {
    console.error("Error from `fetchCartItems`:", error);
  }
};
