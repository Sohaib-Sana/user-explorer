export interface User {
  id: number;
  firstName: string;
  lastName: string;
  maidenName?: string;
  age?: number;
  gender?: string;
  email: string;
  phone?: string;
  username?: string;
  image?: string;
}

export interface UsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

export interface UserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  age?: number;
}