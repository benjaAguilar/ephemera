import { useEffect, useState } from 'react';
import { type User, AuthContext } from './authContext';
import { api } from '../api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await api.auth.getCurrentUser();

        if (user) {
          setUser(user);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>;
}
