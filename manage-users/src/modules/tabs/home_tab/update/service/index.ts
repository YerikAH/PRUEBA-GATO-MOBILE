import { UpdateFormData, UpdateResponse } from "../models";
import * as NetInfo from "@react-native-community/netinfo";
import * as SecureStore from "expo-secure-store";
import { apiClient } from "../../../../../services";
import { imageToBase64 } from "../../../../../utils/image";

export const updateQueryKey = {
  all: ["update"] as const,
  detail: (userId: string) => [...updateQueryKey.all, userId] as const,
};

export const updateUserData = async (
  userId: string,
  formData: UpdateFormData,
  avatarChanged: boolean = false
): Promise<UpdateResponse> => {
  try {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      throw new Error("No hay conexión a internet. Intenta más tarde.");
    }

    const token = await SecureStore.getItemAsync("userToken");

    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const userData: Partial<UpdateFormData> = {
      name: formData.name,
      email: formData.email,
      dni: formData.dni,
    };

    if (formData.avatar && avatarChanged) {
      if (
        !formData.avatar.startsWith("http") &&
        !formData.avatar.startsWith("data:image")
      ) {
        userData.avatar = await imageToBase64(formData.avatar);
      } else {
        userData.avatar = formData.avatar;
      }
    }

    const response = await apiClient.put<{ data: UpdateResponse }>(
      `/users/${userId}`,
      userData,
      config
    );

    return response.data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        error.message || "No se pudo actualizar el usuario. Intenta de nuevo."
      );
    }
    throw new Error("No se pudo actualizar el usuario. Intenta de nuevo.");
  }
};

export const deleteUserData = async (userId: string): Promise<void> => {
  try {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      throw new Error("No hay conexión a internet. Intenta más tarde.");
    }

    const token = await SecureStore.getItemAsync("userToken");

    if (!token) {
      throw new Error("No se encontró token de autenticación");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    await apiClient.delete(`/users/${userId}`, config);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        error.message || "No se pudo eliminar el usuario. Intenta de nuevo."
      );
    }
    throw new Error("No se pudo eliminar el usuario. Intenta de nuevo.");
  }
};
