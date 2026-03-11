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
      }
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
      }
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
