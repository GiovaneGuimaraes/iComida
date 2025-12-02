"use client";

import { Box, Flex, Heading, Button, Icon, Menu } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { PiBowlFoodFill } from "react-icons/pi";
import { useAuth } from "../../../hooks/useAuth";
import { client } from "../../../api/client";
import { LuLogOut, LuUser } from "react-icons/lu";
import { IoMdAdd } from "react-icons/io";
import { FaStoreAlt } from "react-icons/fa";

export default function Header() {
  const router = useRouter();
  const pathName = usePathname();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await client.auth.signOut();
    router.push("/");
  };

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
        <Flex
          gap={"2"}
          alignItems="center"
          color="red.600"
          cursor="pointer"
          onClick={() => router.push("/")}
        >
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

        {pathName === "/register" || pathName === "/login" ? null : (
          <Flex gap="4">
            {!loading && user ? (
              <>
                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button
                      variant="outline"
                      colorScheme="gray"
                      size="md"
                      px={4}
                    >
                      <Icon mr={2}>
                        <LuUser />
                      </Icon>
                      {user.user_metadata.full_name || "Usuário"}
                    </Button>
                  </Menu.Trigger>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item
                        value="logout"
                        color="red.600"
                        cursor="pointer"
                        onClick={handleLogout}
                      >
                        <Icon mr={2}>
                          <LuLogOut />
                        </Icon>
                        Sair
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Menu.Root>

                <Menu.Root>
                  <Menu.Trigger asChild>
                    <Button
                      variant="outline"
                      colorScheme="gray"
                      size="md"
                      px={4}
                    >
                      <Icon>
                        <IoMdAdd />
                      </Icon>
                    </Button>
                  </Menu.Trigger>
                  <Menu.Positioner>
                    <Menu.Content>
                      <Menu.Item
                        value="logout"
                        cursor="pointer"
                        onClick={() => {
                          router.push("/add-store");
                        }}
                      >
                        <Icon mr={2}>
                          <FaStoreAlt />
                        </Icon>
                        Adicionar Restaurante
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Menu.Root>
              </>
            ) : (
              <>
                <Button
                  colorScheme="orange"
                  variant="solid"
                  bgColor={"transparent"}
                  color="gray.700"
                  _hover={{ color: "black" }}
                  size="md"
                  px={8}
                  onClick={() => {
                    router.push("/login");
                  }}
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
                  onClick={() => {
                    router.push("/register");
                  }}
                >
                  Cadastrar
                </Button>
              </>
            )}
          </Flex>
        )}
      </Flex>
    </Box>
  );
}
