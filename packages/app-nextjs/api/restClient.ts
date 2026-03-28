// Funções de autenticação
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

async function authRequest(path: string, options: RequestInit = {}) {
  // Normalize headers to a plain object
  let normalizedHeaders: Record<string, string> = {};
  if (options.headers instanceof Headers) {
    options.headers.forEach((value, key) => {
      normalizedHeaders[key] = value;
    });
  } else if (Array.isArray(options.headers)) {
    options.headers.forEach(([key, value]) => {
      normalizedHeaders[key] = value;
    });
  } else if (options.headers) {
    normalizedHeaders = { ...options.headers } as Record<string, string>;
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...normalizedHeaders,
  };
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || "Request failed");
  }
  return res.json();
}

export const authApi = {
  login: async (email: string, password: string) => {
    const res = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setAuthToken(res.token);
    return res.user;
  },
  register: async (name: string, email: string, password: string) => {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
  },
  getCurrentUser: async () => {
    if (!authToken) throw new Error("Not authenticated");
    return authRequest("/auth/me");
  },
  setToken: setAuthToken,
};
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

async function request(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error.error || "Request failed");
  }

  return res.json();
}

export const api = {
  stores: {
    list: () => request("/stores"),
    get: (id: number) => request(`/stores/${id}`),
    create: (data: {
      name: string;
      image_path: string;
      category: string;
      user_id: string;
    }) =>
      request("/stores", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (
      id: number,
      data: {
        name?: string;
        image_path?: string;
        category?: string;
        active?: boolean;
      },
    ) =>
      request(`/stores/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: number, userId: string) =>
      request(`/stores/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": userId },
      }),
  },
  products: {
    list: (storeId: number) => request(`/products?store_id=${storeId}`),
    get: (id: string) => request(`/products/${id}`),
    create: (data: {
      name: string;
      description: string;
      image: string;
      store_id: number;
      active: boolean;
      metadata: { price: number };
    }) =>
      request("/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    update: (
      id: string,
      data: {
        name?: string;
        description?: string;
        image?: string;
        store_id?: number;
        active?: boolean;
        metadata?: { price: number };
      },
    ) =>
      request(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    delete: (id: string) =>
      request(`/products/${id}`, {
        method: "DELETE",
      }),
  },
};
