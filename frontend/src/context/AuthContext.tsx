import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id?: string;
  email?: string;
  rol?: string;
  productor?: {
    nombre?: string;
    cuit_cuil?: string;
    domicilio?: string;
  };
};

type AuthContextValue = {
  user?: User;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: undefined,
  loading: true,
  refresh: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/me', {
        credentials: 'include',
      });
      if (!response.ok) {
        setUser(undefined);
        return;
      }
      const data = await response.json();
      setUser(data);
    } catch (error) {
      setUser(undefined);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      setUser(undefined);
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
