// RN-033 (UI_SPEC §12.3): estado global de autenticação.
// Restaura token do localStorage no mount e valida via GET /api/v1/me.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getMe, isAuthenticated, logout as clearToken, type AuthUser } from '../utils/auth';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAuthenticated: false,
  loading: false,
  login: () => {},
  logout: () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }

    getMe()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((authUser: AuthUser) => setUser(authUser), []);
  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: user !== null, loading, login, logout }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}