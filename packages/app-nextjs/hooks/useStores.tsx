import { useState } from "react";
import { client } from "../api/client";
import { api } from "../api/restClient";
import * as React from "react";

export enum Category {
  ALL = "Todas",
  PIZZA = "Pizza",
  BURGER = "Hambúrguer",
  JAPANESE = "Japonês",
  MEXICAN = "Mexicano",
  ITALIAN = "Italiana",
  DESSERTS = "Sobremesas",
}

export interface Store {
  id: number;
  name: string;
  image_path: string;
  category: Category;
  user_id: string;
  active: boolean;
  created_at: string;
}

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStores = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.stores.list();

      const storesWithImages = data.map(
        (store: { image_path: string; category: string }) => ({
          ...store,
          image_path: store.image_path?.startsWith("http")
            ? store.image_path
            : store.image_path,
          category: Category[store.category as keyof typeof Category],
        })
      );

      setStores(storesWithImages);
      return storesWithImages;
    } catch (err) {
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Cadastrar loja
  const insertStore = async ({
    name,
    imageFile,
    category,
    user_id,
  }: {
    name: string;
    imageFile: File;
    category: keyof typeof Category;
    user_id: string;
  }) => {
    setLoading(true);
    try {
      // Upload image to Supabase Storage (kept for file storage)
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await client.storage
        .from("stores")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const data = await api.stores.create({
        name,
        image_path: uploadData.path,
        category,
        user_id,
      });

      return [data];
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateStore = async ({
    id,
    name,
    category,
    imageFile,
    active,
  }: {
    id: number;
    name: string;
    category: keyof typeof Category;
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
          .from("stores")
          .upload(filePath, imageFile);
        if (uploadError) throw uploadError;
        image_path = uploadData.path;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        name,
        category,
        active,
      };
      if (image_path) updateData.image_path = image_path;

      const data = await api.stores.update(id, updateData);
      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStore = async ({ id }: { id: number }) => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        throw new Error("Not authorized to delete this store");
      }

      await api.stores.delete(id, user.id);

      // Atualizar a lista local de stores
      setStores((prev) => prev.filter((s) => s.id !== id));

      return true;
    } catch (err) {
      console.error("Delete store error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    stores,
    loading,
    fetchStores,
    insertStore,
    updateStore,
    deleteStore,
  };
}
