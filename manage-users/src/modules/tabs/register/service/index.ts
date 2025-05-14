import { RegisterFormData, RegisterResponse } from "../models";
import * as NetInfo from "@react-native-community/netinfo";
import { apiClient } from "../../../../services";
import { imageToBase64 } from "../../../../utils/image";

export const createUser = async (
  formData: RegisterFormData
): Promise<RegisterResponse> => {
  try {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      throw new Error("No hay conexión a internet. Intenta más tarde.");
    }

    let avatarBase64 = null;
    if (formData.avatar) {
      avatarBase64 = await imageToBase64(formData.avatar);
    }

    const userData: Partial<RegisterFormData> = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      passwordConfirmation: formData.passwordConfirmation,
      dni: formData.dni,
      active: formData.active !== undefined ? formData.active : true,
    };

    if (avatarBase64) {
      userData.avatar = avatarBase64;
    }

    const response = await apiClient.post<RegisterResponse>(
      "/auth/register",
      userData
    );

    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        error.message || "No se pudo registrar el usuario. Intenta de nuevo."
      );
    }
    throw new Error("No se pudo registrar el usuario. Intenta de nuevo.");
  }
};
