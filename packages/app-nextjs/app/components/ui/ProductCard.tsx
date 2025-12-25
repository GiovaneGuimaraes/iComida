import {
  Card,
  Image,
  Flex,
  Heading,
  Text,
  Button,
  Box,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useState } from "react";
import { useProducts } from "../../../hooks/useProducts";
import { Toaster, toaster } from "./toaster";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  active: boolean;
  storeId: number;
  isMyStorePage?: boolean;
  onDeleteSuccess?: () => void;
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  active,
  storeId,
  isMyStorePage,
  onDeleteSuccess,
}: ProductCardProps) {
  const router = useRouter();
  const { deleteProduct } = useProducts();
  const [deleting, setDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct({ id });

      toaster.create({
        title: "Sucesso",
        description: "Produto excluído com sucesso",
        type: "success",
      });

      setTimeout(() => {
        setDialogOpen(false);
        if (onDeleteSuccess) {
          onDeleteSuccess();
        }
      }, 1500);
    } catch (error) {
      toaster.create({
        title: "Erro",
        description: `Não foi possível excluir o produto. Tente novamente mais tarde - ${
          (error as Error).message
        }`,
        type: "error",
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Card.Root
      overflow="hidden"
      cursor="pointer"
      transition="all 0.3s"
      _hover={{
        transform: "translateY(-4px)",
        boxShadow: "xl",
      }}
      position="relative"
      width={`350px`}
    >
      <Toaster />
      <Box
        position="absolute"
        top={3}
        right={3}
        bg={active ? "teal.500" : "red.600"}
        color="white"
        px={3}
        py={1}
        borderRadius="2xl"
        fontSize="sm"
        fontWeight="bold"
        zIndex={2}
      >
        {active ? "Ativo" : "Inativo"}
      </Box>

      <Image
        src={image}
        alt={name}
        height="200px"
        width="100%"
        objectFit="cover"
      />

      <Card.Body p={4}>
        <Heading size="md" mb={2}>
          {name}
        </Heading>
        <Text color="gray.600" fontSize="sm" mb={3}>
          {description}
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color="red.600" mb={4}>
          R$ {price.toFixed(2)}
        </Text>
      </Card.Body>

      <Card.Footer>
        {isMyStorePage && (
          <Flex gap={2} width={"100%"} height={"100%"}>
            <Button
              variant="outline"
              colorPalette="grey"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/admin/my-stores/${storeId}/products/${id}/edit`);
              }}
            >
              <FaRegEdit />
            </Button>
            <Button
              variant="outline"
              colorPalette="red"
              onClick={(e) => {
                e.stopPropagation();
                setDialogOpen(true);
              }}
            >
              <FaRegTrashAlt />
              Excluir
            </Button>
          </Flex>
        )}
      </Card.Footer>

      <Dialog.Root
        open={dialogOpen}
        onOpenChange={(e) => setDialogOpen(e.open)}
        placement="center"
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Confirmar Exclusão</Dialog.Title>
                <Dialog.CloseTrigger asChild>
                  <CloseButton />
                </Dialog.CloseTrigger>
              </Dialog.Header>
              <Dialog.Body>
                <Text>
                  Tem certeza que deseja excluir o produto{" "}
                  <strong>{name}</strong>? Esta ação não pode ser desfeita.
                </Text>
              </Dialog.Body>
              <Dialog.Footer>
                <Flex gap={3} width="100%">
                  <Button
                    flex={1}
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                    disabled={deleting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    flex={1}
                    colorScheme="red"
                    bg="red.600"
                    color="white"
                    onClick={handleDelete}
                    loading={deleting}
                    _hover={{ bg: "red.500" }}
                  >
                    Confirmar Exclusão
                  </Button>
                </Flex>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Card.Root>
  );
}
