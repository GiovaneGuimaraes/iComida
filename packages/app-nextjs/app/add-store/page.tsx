"use client";

import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  Stack,
  Text,
  Select,
  Field,
} from "@chakra-ui/react";
import { toaster, Toaster } from "../components/ui/toaster";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { client } from "../../api/client";
import { useAuth } from "../../hooks/useAuth";
import { Category } from "../page";
import { createListCollection } from "@chakra-ui/react";

const categories = Object.values(Category);

const categoriesCollection = createListCollection({
  items: categories.map((category) => ({
    label: category,
    value: category,
  })),
});

export default function Page() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toaster.create({
        title: "Error",
        description: "Você precisa estar logado para cadastrar uma loja",
        type: "error",
      });
      return;
    }

    if (!imageFile) {
      toaster.create({
        title: "Error",
        description: "Selecione uma imagem da loja",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      // Upload da imagem para o storage
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await client.storage
        .from("stores")
        .upload(filePath, imageFile);

      console.log(uploadData, uploadError);

      if (uploadError) {
        throw uploadError;
      }

      // Inserir loja no banco de dados
      const { data, error } = await client
        .from("stores")
        .insert([
          {
            name: formData.name,
            image_path: uploadData.path,
            category: formData.category,
            user_id: user.id,
            product_list: [],
          },
        ])
        .select();

      console.log(data, error);

      if (error) {
        throw error;
      }

      toaster.create({
        title: "Sucesso",
        description: "Loja cadastrada com sucesso! Redirecionando...",
        type: "success",
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: Error | any) {
      toaster.create({
        title: "Error",
        description: `Erro ao cadastrar loja: ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      py={8}
    >
      <Toaster />
      <Card.Root maxW="lg" width="100%" p={8} boxShadow="xl">
        <Card.Header>
          <Heading size="xl" textAlign="center" color="red.600">
            Cadastrar Loja
          </Heading>
          <Text textAlign="center" color="gray.600" mt={2}>
            Preencha os dados da sua loja
          </Text>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Field.Root required>
                <Field.Label>Nome da Loja</Field.Label>
                <Input
                  name="name"
                  placeholder="Digite o nome da loja"
                  value={formData.name}
                  onChange={handleChange}
                  size="lg"
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Categoria</Field.Label>
                <Select.Root
                  name="category"
                  collection={categoriesCollection}
                  value={[formData.category]}
                  onValueChange={(e) =>
                    setFormData({ ...formData, category: e.value[0] })
                  }
                  size="lg"
                >
                  <Select.Trigger>
                    <Select.ValueText placeholder="Selecione uma categoria" />
                  </Select.Trigger>
                  <Select.Content>
                    {categoriesCollection.items.map((category) => (
                      <Select.Item key={category.value} item={category}>
                        {category.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Field.Root>

              <Field.Root required>
                <Field.Label>Imagem da Loja</Field.Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  size="lg"
                  pt={1}
                />
                {imageFile && (
                  <Text fontSize="sm" color="gray.600" mt={2}>
                    Arquivo selecionado: {imageFile.name}
                  </Text>
                )}
              </Field.Root>

              <Button
                type="submit"
                colorScheme="red"
                bg="red.600"
                color="white"
                size="lg"
                width="100%"
                mt={4}
                loading={loading}
                _hover={{ bg: "red.500" }}
              >
                Cadastrar Loja
              </Button>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
