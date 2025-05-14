import axios from "axios";
import { FetchUsersResponse, User } from "../modules/tabs/home_tab/home/models";
import * as NetInfo from "@react-native-community/netinfo";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const API_URL_DEV =
  Platform.OS === "android"
    ? "http://10.0.2.2:3000/api"
    : "http://localhost:3000/api";

const API_URL = "https://caring-mindfulness-production-76c7.up.railway.app/api";

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const fetchUsers = async (
  page: number = 1
): Promise<FetchUsersResponse> => {
  try {
    const netInfo = await NetInfo.fetch();

    if (!netInfo.isConnected) {
      console.log("No hay conexión a internet");
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
    const response = await apiClient.get(`/users?page=${page}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error al cargar usuarios (página ${page}):`, error);
    throw new Error("No se pudieron cargar los usuarios. Intenta de nuevo.");
  }
};

export const getUserById = async (userId: string): Promise<{ data: User }> => {
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

    const response = await apiClient.get(`/users/${userId}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener usuario (ID: ${userId}):`, error);
    throw new Error("No se pudo obtener el usuario. Intenta de nuevo.");
  }
};
