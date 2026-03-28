/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import { authApi } from "../../api/restClient";

export const AuthContext = React.createContext<any>(null);

export const AuthProvider = (props: { children: React.ReactNode }) => {
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState<boolean>(true);

  // Função para recarregar o usuário
  const reloadUser = async () => {
    setLoading(true);
    try {
      const user = await authApi.getCurrentUser();
      setUser(user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Função para logout
  const logout = async () => {
    await authApi.setToken(null);
    setUser(null);
  };

  React.useEffect(() => {
    reloadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, reloadUser, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};
