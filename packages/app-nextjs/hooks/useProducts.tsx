import { useState } from "react";
import { api } from "../api/restClient";
import * as React from "react";

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
      const data = await api.products.list(storeId);

      setProducts(data);
      return data;
    } catch (err) {
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
      // Upload image via REST API
      const formData = new FormData();
      formData.append("image", imageFile);
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!uploadRes.ok) throw new Error("Erro ao fazer upload da imagem");
      const uploadData = await uploadRes.json();

      const data = await api.products.create({
        name,
        description,
        image: uploadData.url,
        store_id,
        active: true,
        metadata: { price },
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
      let image_url;
      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) throw new Error("Erro ao fazer upload da imagem");
        const uploadData = await uploadRes.json();
        image_url = uploadData.url;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        name,
        description,
        active,
        store_id,
        metadata: { price },
      };
      if (image_url) updateData.image = image_url;

      const data = await api.products.update(id, updateData);
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
      await api.products.delete(id);

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
