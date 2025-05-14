export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
  passwordConfirmation: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    name: string;
    email: string;
    active: boolean;
    avatar: string;
    dni: string;
    createdAt: string;
    updatedAt: string;
  };
}
