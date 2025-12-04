import {
  Card,
  Image,
  Flex,
  Heading,
  Text,
  Button,
  Box,
} from "@chakra-ui/react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
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
                <Button variant="outline" colorPalette="grey">
                  <FaRegEdit />
                </Button>
                <Button variant="outline" colorPalette="red">
                  <FaRegTrashAlt />
                </Button>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Card.Body>
    </Card.Root>
  );
}
