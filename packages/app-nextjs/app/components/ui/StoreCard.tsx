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
import { FiPackage } from "react-icons/fi";
import { useState } from "react";
import { useStores } from "../../../hooks/useStores";
import { Toaster, toaster } from "./toaster";

interface StoreCardProps {
  id: number;
  name: string;
  image_path: string;
  category: string;
  active: boolean;
  isMyStorePage?: boolean;
  onDeleteSuccess?: () => void;
}

export function StoreCard({
  id,
  name,
  image_path,
  category,
  active,
  isMyStorePage,
  onDeleteSuccess,
}: StoreCardProps) {
  const router = useRouter();
  const { deleteStore } = useStores();
  const [deleting, setDeleting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteStore({ id: Number(id) });

      toaster.create({
        title: "Sucesso",
        description: "Loja excluída com sucesso",
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
        description: `Não foi possível excluir a loja. Tente novamente mais tarde - ${
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
    >
      <Toaster />
      {isMyStorePage && (
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
          {active ? "Ativa" : "Inativa"}
        </Box>
      )}
      <Image
        src={image_path}
        alt={name}
        height="250px"
        objectFit="cover"
        width="100%"
      />
      <Card.Body>
        <Flex align="center" flexDirection="column" gap={4}>
          <Flex justify="space-between" align="center" width="full">
            <Heading size="lg">{name}</Heading>
            <Text
              fontSize="sm"
              color="gray.600"
              bg="gray.100"
              px={3}
              py={1}
              borderRadius="full"
            >
              {category}
            </Text>
          </Flex>

          {isMyStorePage && (
            <Flex width="full" flexDirection="column" gap="4">
              <Flex gap={4}>
                <Flex flexDirection={"column"} gap={1}>
                  <Text fontSize="md">99</Text>
                  <Text fontSize="md" color="gray.500">
                    Produtos
                  </Text>
                </Flex>
                <Flex flexDirection={"column"} gap={1}>
                  <Text fontSize="md">99</Text>
                  <Text fontSize="md" color="gray.500">
                    Pedidos
                  </Text>
                </Flex>
              </Flex>

              <Flex gap={3} justifyContent={"center"}>
                <Button variant="outline" colorPalette="grey">
                  <FiPackage />
                  Produtos
                </Button>
                <Button
                  variant="outline"
                  colorPalette="grey"
                  onClick={() => {
                    router.push(`/admin/my-stores/${id}/edit`);
                  }}
                >
                  <FaRegEdit />
                </Button>
                {/* Dialog para confirmação de exclusão */}
                <Dialog.Root
                  open={dialogOpen}
                  onOpenChange={(e) => setDialogOpen(e.open)}
                >
                  <Dialog.Trigger asChild>
                    <Button variant="outline" colorPalette="red">
                      <FaRegTrashAlt />
                    </Button>
                  </Dialog.Trigger>
                  <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                      <Dialog.Content>
                        <Dialog.Header>
                          <Dialog.Title>Excluir loja</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                          Tem certeza que deseja excluir esta loja? Esta ação
                          não pode ser desfeita.
                        </Dialog.Body>
                        <Dialog.Footer>
                          <Dialog.ActionTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setDialogOpen(false)}
                            >
                              Cancelar
                            </Button>
                          </Dialog.ActionTrigger>
                          <Button
                            colorPalette="red"
                            onClick={handleDelete}
                            disabled={deleting}
                          >
                            Excluir
                          </Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                          <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                      </Dialog.Content>
                    </Dialog.Positioner>
                  </Portal>
                </Dialog.Root>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
