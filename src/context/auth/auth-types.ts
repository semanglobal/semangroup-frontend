export interface UserData {
  id?: string;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: UserData | null;
  login: (token: string) => void;
  logout: () => void;
}