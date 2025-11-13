import React, { createContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: number;
  name?: string;
  email: string;
  role: string;
  avatar?: string | null;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  setAuth: (token: string | null, user: User | null) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  setAuth: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      const t = localStorage.getItem('token');
      if (raw) setUser(JSON.parse(raw));
      if (t) setToken(t);
    } catch (e) {
      // ignore
    }
  }, []);

  const setAuth = (tok: string | null, usr: User | null) => {
    setToken(tok);
    setUser(usr);
    if (tok) localStorage.setItem('token', tok); else localStorage.removeItem('token');
    if (usr) localStorage.setItem('user', JSON.stringify(usr)); else localStorage.removeItem('user');
  };

  const logout = () => {
    setAuth(null, null);
  };

  return (
    <AuthContext.Provider value={{ user, token, setAuth, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
