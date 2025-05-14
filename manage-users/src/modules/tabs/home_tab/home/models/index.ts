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

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface FetchUsersResponse {
  success: boolean;
  message: string;
  data: User[];
  pagination: Pagination;
}

export interface UsersState {
  users: User[];
  pagination: Pagination;
  hasData: boolean;
  setUsers: (response: FetchUsersResponse) => void;
  updateUserStatus: (userId: string, active: boolean) => void;
  reset: () => void;
}
