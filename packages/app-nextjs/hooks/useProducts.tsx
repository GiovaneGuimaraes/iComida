import { useState } from "react";
import { client } from "../api/client";
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
      // Upload image to Supabase Storage (kept for file storage)
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await client.storage
        .from("products")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const data = await api.products.create({
        name,
        description,
        image: uploadData.path,
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
      let image_path;
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;
        const { data: uploadData, error: uploadError } = await client.storage
          .from("products")
          .upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        image_path = uploadData.path;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        name,
        description,
        active,
        store_id,
        metadata: { price },
      };
      if (image_path) updateData.image = image_path;

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
