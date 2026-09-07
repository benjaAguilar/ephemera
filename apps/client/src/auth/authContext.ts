import { createContext } from 'react';

export type User = {
  id: number;
  username: string;
};

export type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
