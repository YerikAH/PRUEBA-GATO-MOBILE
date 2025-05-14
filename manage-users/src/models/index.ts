export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  avatar: string | null;
  dni: string | null;
  createdAt: string;
  updatedAt: string;
}
