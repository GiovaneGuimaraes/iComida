"use client";

import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text,
  Card,
  FileUpload,
  Image,
  Flex,
  Switch,
  Textarea,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Product, useProducts } from "../../../../../../../hooks/useProducts";
import { toaster, Toaster } from "../../../../../../components/ui/toaster";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function Page() {
  const { id, productId }: { id: string; productId: string } = useParams();
  const router = useRouter();
  const { fetchProducts, updateProduct } = useProducts();
  const [product, setProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: string;
  } | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [initialFormData, setInitialFormData] = useState<{
    name: string;
    description: string;
    price: string;
  } | null>(null);
  const [formActive, setFormActive] = useState<boolean | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      const products = await fetchProducts(Number(id));
      const found = products.find((p) => p.id === productId);
      if (found) {
        setProduct(found);
        const initial = {
          name: found.name,
          description: found.description,
          price: found.metadata.price.toString(),
        };
        setFormData(initial);
        setInitialFormData(initial);
        setFormActive(found.active);
      }
    };
    loadProduct();
  }, [id, productId, fetchProducts]);

  console.log("Product to edit:", product);
  console.log("Form Data:", formData);

  const isDirty =
    formData &&
    initialFormData &&
    (formData.name !== initialFormData.name ||
      formData.description !== initialFormData.description ||
      formData.price !== initialFormData.price ||
      imageFile !== null ||
      formActive !== product?.active);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!formData) return;
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!formData || formActive === null) return;
      await updateProduct({
        id: productId,
        store_id: Number(id),
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        imageFile,
        active: formActive,
      });
      toaster.create({
        title: "Sucesso",
        description: "Produto atualizado com sucesso! Redirecionando...",
        type: "success",
      });
      setTimeout(() => {
        router.push(`/admin/my-stores/${id}/products`);
      }, 1500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: Error | any) {
      toaster.create({
        title: "Error",
        description: `Erro ao atualizar produto: ${error.message}`,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Flex mx="auto" p={8} maxW="800px" width="100%">
      <Toaster />
      <Card.Root width="100%" p={8} boxShadow="xl">
        <Flex pt={6} px={6}>
          <Button
            variant="solid"
            size={"xs"}
            colorPalette={"red"}
            onClick={() => router.push(`/admin/my-stores/${id}/products`)}
          >
            <IoMdArrowRoundBack />
          </Button>
        </Flex>
        <Card.Body>
          <Heading size="lg" mb={2} textAlign={"center"} color="red.600">
            Editar Produto
          </Heading>
          {formData && formActive !== null ? (
            <form onSubmit={handleSubmit}>
              <Stack gap={4} width={"full"}>
                <Box>
                  <Text fontWeight="semibold">Nome do Produto</Text>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                </Box>
                <Box>
                  <Text fontWeight="semibold">Descrição</Text>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    size="lg"
                    rows={4}
                    required
                  />
                </Box>
                <Box>
                  <Text fontWeight="semibold">Preço (R$)</Text>
                  <Input
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleChange}
                    size="lg"
                    required
                  />
                </Box>
                <Box>
                  <Text fontWeight="semibold" mb={2}>
                    Produto ativo?
                  </Text>
                  <Switch.Root
                    checked={formActive}
                    onCheckedChange={(details) =>
                      setFormActive(details.checked)
                    }
                    colorPalette="red"
                    size="lg"
                  >
                    <Switch.HiddenInput />
                    <Switch.Control />
                    <Switch.Label>
                      {formActive ? "Ativo" : "Inativo"}
                    </Switch.Label>
                  </Switch.Root>
                </Box>
                <Box>
                  <Text fontWeight="semibold">Imagem do Produto</Text>
                  <FileUpload.Root
                    accept={{ "image/*": [] }}
                    maxFiles={1}
                    onFileChange={(details) => {
                      const file = details.acceptedFiles[0];
                      setImageFile(file ?? null);
                    }}
                  >
                    <FileUpload.HiddenInput />
                    <FileUpload.Dropzone
                      width="full"
                      cursor="pointer"
                      position="relative"
                      minH="180px"
                    >
                      {product?.image && (
                        <Image
                          src={
                            imageFile
                              ? URL.createObjectURL(imageFile)
                              : product.image
                          }
                          alt={product.name}
                          height="100%"
                          width="100%"
                          objectFit="cover"
                          position="absolute"
                          top={0}
                          left={0}
                          opacity={0.3}
                          zIndex={1}
                          borderRadius="md"
                        />
                      )}
                      <Box
                        position="relative"
                        zIndex={2}
                        width="100%"
                        height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        minH="200px"
                      >
                        <Text color="gray.800" textAlign="center">
                          Arraste ou selecione uma imagem
                        </Text>
                      </Box>
                    </FileUpload.Dropzone>
                    <FileUpload.List clearable />
                  </FileUpload.Root>
                </Box>
                <Card.Footer justifyContent="flex-end" mt={4}>
                  <Button
                    type="submit"
                    colorScheme="red"
                    bg="red.600"
                    color="white"
                    size="lg"
                    width="100%"
                    disabled={submitting || !isDirty}
                  >
                    Salvar Alterações
                  </Button>
                </Card.Footer>
              </Stack>
            </form>
          ) : (
            <Text textAlign="center" color="gray.500" py={8}>
              Carregando produto...
            </Text>
          )}
        </Card.Body>
      </Card.Root>
    </Flex>
  );
}
