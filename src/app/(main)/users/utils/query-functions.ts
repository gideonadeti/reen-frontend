import { AxiosInstance } from "axios";

export const fetchUsers = async (axios: AxiosInstance) => {
  try {
    const response = await axios.get("/auth/find-all");

    return response.data;
  } catch (error) {
    console.error("Error from `fetchUsers`:", error);

    throw error;
  }
};
