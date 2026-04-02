export interface AuthUser {
  email: string;
}

export interface RegisteredUser {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}