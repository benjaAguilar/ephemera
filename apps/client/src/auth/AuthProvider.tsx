import { useEffect, useState } from 'react';
import { getCurrentUser } from './auth.api';
import { type User, AuthContext } from './authContext';

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
