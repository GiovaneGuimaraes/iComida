import { useState } from "react";
import { client } from "../api/client";
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product_list: any[];
  active: boolean;
  created_at: string;
}

export function useStores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStores = React.useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await client
        .from("stores")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const storesWithImages = data.map((store) => ({
        ...store,
        image_path: store.image_path.startsWith("http")
          ? store.image_path
          : client.storage.from("stores").getPublicUrl(store.image_path).data
              .publicUrl,
        category: Category[store.category as keyof typeof Category],
      }));

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
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await client.storage
        .from("stores")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      const { data, error } = await client
        .from("stores")
        .insert([
          {
            name,
            image_path: uploadData.path,
            category,
            user_id,
            product_list: [],
          },
        ])
        .select();

      if (error) throw error;

      return data;
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
    productList,
    active,
  }: {
    id: number;
    name: string;
    category: keyof typeof Category;
    imageFile?: File | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    productList: any[];
    active: boolean;
  }) => {
    console.log("updateStore called with:", {
      id,
      name,
      category,
      imageFile,
    });
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
        product_list: productList,
        active,
      };
      if (image_path) updateData.image_path = image_path;

      const { data, error } = await client
        .from("stores")
        .upsert({ id: id, ...updateData })
        .select("*");

      console.log("Update response:", { data, error });

      if (error) throw error;
      return data?.[0];
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteStore = async ({ id }: { id: number }) => {
    setLoading(true);
    try {
      // 1) Validar propriedade
      const { data: store, error: storeErr } = await client
        .from("stores")
        .select("user_id")
        .eq("id", id)
        .single();

      console.log("Store to delete:", { store, storeErr });
      if (storeErr) throw storeErr;

      // Verifica se o usuário autenticado é o dono da loja
      const {
        data: { user },
      } = await client.auth.getUser();

      console.log("Current user:", user?.id);
      console.log("Store owner:", store.user_id);

      if (!user || store.user_id !== user.id) {
        throw new Error("Not authorized to delete this store");
      }

      // 2) Deletar products primeiro (opcional se FK cascade existir)
      const { error: pErr } = await client
        .from("products")
        .delete()
        .eq("store_id", id);
      if (pErr) {
        console.error("Error deleting products:", pErr);
        throw pErr;
      }

      console.log("Products deleted for store:", id);

      // 3) Deletar store - usando apenas .eq sem .select
      const { error: deleteError } = await client
        .from("stores")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        throw deleteError;
      }

      console.log("Store deleted successfully:", id);

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
