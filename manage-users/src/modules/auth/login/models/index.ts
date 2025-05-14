export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    token: string;
    user?: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
    };
  };
}
