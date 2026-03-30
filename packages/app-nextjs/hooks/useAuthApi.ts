"use client";

import { requestJson, requestWithAuth, setAuthToken } from "./apiClient";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export async function login(email: string, password: string) {
  const response = await requestJson<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  setAuthToken(response.token);
  return response.user;
}

export async function register(name: string, email: string, password: string) {
  return requestJson<AuthUser>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getCurrentUser() {
  return requestWithAuth<AuthUser>("/auth/me");
}

export function logout() {
  setAuthToken(null);
}

export function useAuthApi() {
  return {
    login,
    register,
    getCurrentUser,
    logout,
    setToken: setAuthToken,
  };
}
