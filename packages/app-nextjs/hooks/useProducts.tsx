import { useState } from "react";
import * as React from "react";
import { requestJson, uploadImage } from "./apiClient";

export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  store_id: number;
  active: boolean;
  metadata: {
    price: number;
  };
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = React.useCallback(async (storeId: number) => {
    setLoading(true);
    try {
      const data = await requestJson<Product[]>(
        `/products?store_id=${storeId}`,
      );

      setProducts(data);
      return data;
    } catch {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const insertProduct = async ({
    name,
    description,
    price,
    imageFile,
    store_id,
  }: {
    name: string;
    description: string;
    price: number;
    imageFile: File;
    store_id: number;
  }) => {
    setLoading(true);
    try {
      const uploadData = await uploadImage(imageFile);

      const data = await requestJson<Product>("/products", {
        method: "POST",
        body: JSON.stringify({
          name,
          description,
          image: uploadData.url,
          store_id,
          active: true,
          metadata: { price },
        }),
      });

      return [data];
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async ({
    id,
    store_id,
    name,
    description,
    price,
    imageFile,
    active,
  }: {
    id: string;
    store_id: number;
    name: string;
    description: string;
    price: number;
    imageFile?: File | null;
    active: boolean;
  }) => {
    setLoading(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const uploadData = await uploadImage(imageFile);
        imageUrl = uploadData.url;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        name,
        description,
        active,
        store_id,
        metadata: { price },
      };
      if (imageUrl) updateData.image = imageUrl;

      const data = await requestJson<Product>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(updateData),
      });
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async ({ id }: { id: string }) => {
    setLoading(true);
    try {
      await requestJson<{ success: boolean }>(`/products/${id}`, {
        method: "DELETE",
      });

      setProducts((prev) => prev.filter((p) => p.id !== id));

      return true;
    } catch (err) {
      console.error("Delete product error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    products,
    loading,
    fetchProducts,
    insertProduct,
    updateProduct,
    deleteProduct,
  };
}
