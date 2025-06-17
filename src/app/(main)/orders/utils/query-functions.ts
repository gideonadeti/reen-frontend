import { AxiosInstance } from "axios";

export const fetchOrders = async (axios: AxiosInstance) => {
  try {
    const response = await axios.get("/orders");

    return response.data;
  } catch (error) {
    console.error("Error from `fetchOrders`:", error);

    throw error;
  }
};
