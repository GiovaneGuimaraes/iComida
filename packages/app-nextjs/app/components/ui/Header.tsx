"use client";

import { Box, Flex, Heading, Button, Icon } from "@chakra-ui/react";
import { PiBowlFoodFill } from "react-icons/pi";

export default function Header() {
  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={1000}
      bg="gray.100"
      borderBottom="0.5px solid"
      borderColor="gray.200"
      boxShadow="md"
    >
      <Flex
        maxW="1400px"
        mx="auto"
        px={6}
        py={4}
        justify="space-between"
        align="center"
      >
        <Flex gap={"2"} alignItems="center" color="red.600">
          <Icon size={"xl"}>
            <PiBowlFoodFill />
          </Icon>
          <Heading
            as="h1"
            size="xl"
            color="red.600"
            fontWeight="bold"
            letterSpacing="tight"
          >
            iComida
          </Heading>
        </Flex>

        <Flex gap="4">
          <Button
            colorScheme="orange"
            variant="solid"
            bgColor={"transparent"}
            color="gray.700"
            _hover={{ color: "black" }}
            size="md"
            px={8}
          >
            Entrar
          </Button>
          <Button
            colorScheme="orange"
            variant="solid"
            bg="red.600"
            color="white"
            _hover={{ bg: "red.400" }}
            size="md"
            px={8}
          >
            Cadastrar
          </Button>
        </Flex>
      </Flex>
    </Box>
  );
}
