export interface UpdateFormData {
  name: string;
  email: string;
  dni: string;
  avatar?: string;
}

export interface UpdatedUser {
  id: string;
  name: string;
  email: string;
  dni: string;
  avatar: string | null;
  updatedAt: string;
}

export interface UpdateResponse {
  success: boolean;
  message: string;
  data: UpdatedUser;
}
