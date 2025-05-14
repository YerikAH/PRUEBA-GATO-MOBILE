import { AxiosResponse } from "axios";
import { LoginCredentials, LoginResponse } from "../models";
import { apiClient } from "../../../../services";

export const loginUser = async (
  credentials: LoginCredentials
): Promise<AxiosResponse<LoginResponse>> => {
  return await apiClient.post<LoginResponse>("/auth/login", credentials);
};
