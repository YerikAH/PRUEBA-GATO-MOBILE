import { apiClient } from "../../../../../services";
import * as SecureStore from "expo-secure-store";

export const updateUserStatus = async (userId: string, active: boolean) => {
  const token = await SecureStore.getItemAsync("userToken");

  if (!token) {
    throw new Error("No se encontró token de autenticación");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await apiClient.put(`/users/${userId}`, { active }, config);
  return response.data;
};
