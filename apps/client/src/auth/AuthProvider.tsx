import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser } from './auth.api';

type User = {
  id: number;
  username: string;
};

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await getCurrentUser();

        if (res) {
          setUser(res.user);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
