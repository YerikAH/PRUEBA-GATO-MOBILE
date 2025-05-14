import { AxiosResponse } from "axios";
import { apiClient } from "../../../../services";
import { RegisterCredentials, RegisterResponse } from "../models";

export const registerUser = async (
  userData: RegisterCredentials
): Promise<AxiosResponse<RegisterResponse>> => {
  return await apiClient.post<RegisterResponse>("/auth/register", userData);
};
