"use client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
const AUTH_TOKEN_STORAGE_KEY = "icomida.auth.token";

let authToken: string | null = null;

function canUseStorage() {
  return typeof window !== "undefined";
}

function getStoredAuthToken() {
  if (authToken) {
    return authToken;
  }

  if (!canUseStorage()) {
    return null;
  }

  authToken = window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
  return authToken;
}

export function setAuthToken(token: string | null) {
  authToken = token;

  if (!canUseStorage()) {
    return;
  }

  if (token) {
    window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

function normalizeHeaders(headers?: HeadersInit) {
  const normalizedHeaders: Record<string, string> = {};

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      normalizedHeaders[key] = value;
    });
    return normalizedHeaders;
  }

  if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      normalizedHeaders[key] = value;
    });
    return normalizedHeaders;
  }

  return headers ? { ...headers } : normalizedHeaders;
}

async function parseResponse<T>(response: Response) {
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: response.statusText || "Request failed" }));

    throw new Error(error.error || "Request failed");
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
}

export async function requestJson<T>(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...normalizeHeaders(options.headers),
    },
  });

  return parseResponse<T>(response);
}

export async function requestWithAuth<T>(
  path: string,
  options: RequestInit = {},
) {
  const token = getStoredAuthToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...normalizeHeaders(options.headers),
    },
  });

  return parseResponse<T>(response);
}

export async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  return parseResponse<{ url: string }>(response);
}
