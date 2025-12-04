import {
  Card,
  Image,
  Flex,
  Heading,
  Text,
  Button,
  Box,
} from "@chakra-ui/react";
import { FaRegEdit } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

interface StoreCardProps {
  name: string;
  image_path: string;
  category: string;
  active: boolean;
  isMyStorePage?: boolean;
}

export function StoreCard({
  name,
  image_path,
  category,
  active,
  isMyStorePage,
}: StoreCardProps) {
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
      {isMyStorePage && active && (
        <Box
          position="absolute"
          top={3}
          right={3}
          bg="teal.500"
          color="white"
          px={3}
          py={1}
          borderRadius="2xl"
          fontSize="sm"
          fontWeight="bold"
          zIndex={2}
        >
          Ativa
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
            <Flex width="full" flexDirection="column" gap="2">
              <Button variant="solid" colorPalette="teal">
                <FaRegEdit />
                Editar
              </Button>
              <Button variant="solid" colorPalette="purple">
                <IoMdAdd /> Adicionar produtos
              </Button>
            </Flex>
          )}
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
