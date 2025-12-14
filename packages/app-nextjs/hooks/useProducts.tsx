import { useState } from "react";
import { client } from "../api/client";
import * as React from "react";

export interface Product {
  id: number;
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
      const { data, error } = await client
        .from("products")
        .select("*")
        .eq("store_id", storeId);

      if (error) throw error;

      const productsWithImages = data.map((product) => ({
        ...product,
        image: product.image?.startsWith("http")
          ? product.image
          : client.storage.from("products").getPublicUrl(product.image).data
              .publicUrl,
      }));

      setProducts(productsWithImages);
      return productsWithImages;
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
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await client.storage
        .from("products")
        .upload(filePath, imageFile);

      console.log(uploadData, uploadError);

      if (uploadError) throw uploadError;

      const { data, error } = await client
        .from("products")
        .insert([
          {
            name,
            description,
            image: uploadData.path,
            store_id,
            active: true,
            metadata: { price },
          },
        ])
        .select("*");

      console.log(data, error);

      if (error) throw error;

      return data;
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async ({
    id,
    name,
    description,
    price,
    imageFile,
    active,
  }: {
    id: number;
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
        metadata: { price },
      };
      if (image_path) updateData.image = image_path;

      const { data, error } = await client
        .from("products")
        .upsert({ id: id, ...updateData })
        .select("*");

      if (error) throw error;
      return data?.[0];
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async ({ id }: { id: number }) => {
    setLoading(true);
    try {
      const { error: deleteError } = await client
        .from("products")
        .delete()
        .eq("id", id);

      if (deleteError) {
        console.error("Delete error:", deleteError);
        throw deleteError;
      }

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
