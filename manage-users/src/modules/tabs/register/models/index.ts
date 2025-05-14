export interface RegisterFormData {
  name: string;
  email: string;
  dni: string;
  password: string;
  passwordConfirmation: string;
  avatar?: string;
  active?: boolean;
}

export interface RegisterUser {
  id: string;
  name: string;
  email: string;
  active: boolean;
  avatar: string;
  dni: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: RegisterUser;
}
