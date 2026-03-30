import { useState } from "react";
import * as React from "react";
import { requestJson, uploadImage } from "./apiClient";
import { getCurrentUser } from "./useAuthApi";

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

interface StoreResponse extends Omit<Store, "category"> {
  category: string;
}

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStores = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await requestJson<StoreResponse[]>("/stores");

      const storesWithImages: Store[] = data.map((store) => ({
        ...store,
        category: Category[store.category as keyof typeof Category],
      }));

      setStores(storesWithImages);
      return storesWithImages;
    } catch {
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
      const uploadData = await uploadImage(imageFile);

      const data = await requestJson<Store>("/stores", {
        method: "POST",
        body: JSON.stringify({
          name,
          image_path: uploadData.url,
          category,
          user_id,
        }),
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
      let imageUrl: string | undefined;
      if (imageFile) {
        const uploadData = await uploadImage(imageFile);
        imageUrl = uploadData.url;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updateData: any = {
        name,
        category,
        active,
      };
      if (imageUrl) updateData.image_path = imageUrl;

      const data = await requestJson<Store>(`/stores/${id}`, {
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

  const deleteStore = async ({ id }: { id: number }) => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user || !user.id) {
        throw new Error("Not authorized to delete this store");
      }
      await requestJson<{ success: boolean }>(`/stores/${id}`, {
        method: "DELETE",
        headers: { "x-user-id": user.id },
      });

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
