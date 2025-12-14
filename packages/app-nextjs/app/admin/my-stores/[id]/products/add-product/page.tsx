"use client";

import {
  Button,
  Card,
  Heading,
  Input,
  Stack,
  Text,
  Field,
  FileUpload,
  Flex,
  Textarea,
} from "@chakra-ui/react";
import { toaster, Toaster } from "../../../../../components/ui/toaster";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useProducts } from "../../../../../../hooks/useProducts";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { insertProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!imageFile) {
      toaster.create({
        title: "Error",
        description: "Selecione uma imagem do produto",
        type: "error",
      });
      return;
    }

    setLoading(true);

    try {
      await insertProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        imageFile,
        store_id: Number(id),
      });

      toaster.create({
        title: "Sucesso",
        description: "Produto cadastrado com sucesso! Redirecionando...",
        type: "success",
      });

      setTimeout(() => {
        router.push(`/admin/my-stores/${id}/products`);
      }, 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: Error | any) {
      toaster.create({
        title: "Error",
        description: `Erro ao cadastrar produto: ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Flex justifyContent="center" alignItems="center" width="100%" py={8}>
      <Toaster />
      <Card.Root maxW="lg" width="100%" p={8} boxShadow="xl">
        <Flex>
          <Button
            variant="solid"
            size={"xs"}
            colorPalette={"red"}
            onClick={() => router.back()}
          >
            <IoMdArrowRoundBack />
          </Button>
        </Flex>
        <Card.Header>
          <Flex gap={4} width={"full"}></Flex>
          <Heading size="xl" textAlign="center" color="red.600">
            Cadastrar Produto
          </Heading>
          <Text textAlign="center" color="gray.600" mt={2}>
            Preencha os dados do seu produto
          </Text>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Field.Root required>
                <Field.Label>Nome do Produto</Field.Label>
                <Input
                  name="name"
                  placeholder="Digite o nome do produto"
                  value={formData.name}
                  onChange={handleChange}
                  size="lg"
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Descrição</Field.Label>
                <Textarea
                  name="description"
                  placeholder="Descreva o produto"
                  value={formData.description}
                  onChange={handleChange}
                  size="lg"
                  rows={4}
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Preço (R$)</Field.Label>
                <Input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={handleChange}
                  size="lg"
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Imagem do Produto</Field.Label>
                <FileUpload.Root
                  accept={{ "image/*": [] }}
                  maxFiles={1}
                  onFileChange={(details) => {
                    const file = details.acceptedFiles[0];
                    setImageFile(file ?? null);
                  }}
                >
                  <FileUpload.HiddenInput />
                  <FileUpload.Dropzone width="full" cursor="pointer">
                    <FileUpload.DropzoneContent>
                      Arraste ou selecione uma imagem
                    </FileUpload.DropzoneContent>
                  </FileUpload.Dropzone>
                  <FileUpload.List clearable />
                </FileUpload.Root>
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
                Cadastrar Produto
              </Button>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
}
