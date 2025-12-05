"use client";

import {
  Box,
  Button,
  Heading,
  Input,
  Stack,
  Text,
  Portal,
  createListCollection,
  Card,
  FileUpload,
  Image,
  Flex,
  Switch,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Category, Store, useStores } from "../../../../../hooks/useStores";
import { toaster, Toaster } from "../../../../components/ui/toaster";
import { IoMdArrowRoundBack } from "react-icons/io";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchStores, updateStore } = useStores();
  const [store, setStore] = useState<Store | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [initialFormData, setInitialFormData] = useState({
    name: "",
    category: "",
  });
  const [formActive, setFormActive] = useState(true);

  useEffect(() => {
    const loadStore = async () => {
      const stores = await fetchStores();
      const found = stores.find((s) => {
        return s.id === Number(id);
      });

      if (found) {
        setStore(found);
        const categoryKey =
          Object.keys(Category).find(
            (key) => Category[key as keyof typeof Category] === found.category
          ) || "";
        const initial = {
          name: found.name,
          category: categoryKey,
        };
        setFormData(initial);
        setInitialFormData(initial);
        setFormActive(found.active);
      }
    };
    loadStore();
  }, [id]);

  const isDirty =
    formData.name !== initialFormData.name ||
    formData.category !== initialFormData.category ||
    imageFile !== null ||
    formActive !== store?.active;

  const categoriesCollection = createListCollection({
    items: Object.entries(Category)
      .filter(([key]) => key !== "ALL")
      .map(([key, value]) => ({
        label: value,
        value: key,
      })),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateStore({
        id: Number(id),
        name: formData.name,
        category: formData.category as keyof typeof Category,
        imageFile,
        productList: store?.product_list || [],
        active: formActive,
      });

      toaster.create({
        title: "Sucesso",
        description: "Loja atualizada com sucesso! Redirecionando...",
        type: "success",
      });

      setTimeout(() => {
        router.push("/admin/my-stores");
      }, 2000);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: Error | any) {
      toaster.create({
        title: "Error",
        description: `Erro ao atualizar loja: ${error.message}`,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box maxW="lg" mx="auto" p={8}>
      <Toaster />
      <Card.Root width="100%" maxW="lg">
        <Flex pt={6} px={6}>
          <Button
            variant="solid"
            size={"xs"}
            colorPalette={"red"}
            onClick={() => router.back()}
          >
            <IoMdArrowRoundBack />
          </Button>
        </Flex>

        <Card.Body gap={6}>
          <Heading size="lg" mb={2} textAlign={"center"} color="red.600">
            Editar Loja
          </Heading>

          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Box>
                <Text fontWeight="semibold">Nome da Loja</Text>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  size="lg"
                  required
                />
              </Box>
              <Box>
                <Text fontWeight="semibold">Categoria</Text>
                <Select.Root
                  name="category"
                  collection={categoriesCollection}
                  value={[formData.category]}
                  onValueChange={(details) =>
                    setFormData({ ...formData, category: details.value[0] })
                  }
                  size="lg"
                  width="100%"
                  required
                  variant="outline"
                  colorPalette="red"
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText placeholder="Selecione uma categoria" />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Portal>
                    <Select.Positioner>
                      <Select.Content>
                        {categoriesCollection.items.map((category) => (
                          <Select.Item item={category} key={category.value}>
                            {category.label}
                          </Select.Item>
                        ))}
                      </Select.Content>
                    </Select.Positioner>
                  </Portal>
                </Select.Root>
              </Box>
              <Box>
                <Text fontWeight="semibold" mb={2}>
                  Loja ativa?
                </Text>
                <Switch.Root
                  checked={formActive}
                  onCheckedChange={(details) => setFormActive(details.checked)}
                  colorPalette="red"
                  size="lg"
                >
                  <Switch.HiddenInput />
                  <Switch.Control />
                  <Switch.Label>
                    {formActive ? "Ativa" : "Inativa"}
                  </Switch.Label>
                </Switch.Root>
              </Box>
              <Box>
                <Text fontWeight="semibold">Imagem da Loja</Text>
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
                    {store?.image_path && (
                      <Image
                        src={
                          imageFile
                            ? URL.createObjectURL(imageFile)
                            : store.image_path
                        }
                        alt={store.name}
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
                      minH="180px"
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
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
