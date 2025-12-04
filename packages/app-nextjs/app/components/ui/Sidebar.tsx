"use client";

import {
  Box,
  Flex,
  Heading,
  Icon,
  VStack,
  Text,
  Button,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import { PiBowlFoodFill } from "react-icons/pi";
import { LuStore, LuLogOut } from "react-icons/lu";
import { useAuth } from "../../../hooks/useAuth";
import { client } from "../../../api/client";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  const handleLogout = async () => {
    await client.auth.signOut();
    router.push("/");
  };

  const menuItems = [
    {
      label: "Minhas Lojas",
      icon: LuStore,
      path: "/admin/my-stores",
    },
  ];

  return (
    <Flex
      direction="column"
      w="280px"
      h="100vh"
      bg="white"
      borderRight="1px solid"
      borderColor="gray.200"
      position="fixed"
      left={0}
      top={0}
      p={6}
      justify="space-between"
    >
      {/* Logo */}
      <VStack gap={8} align="stretch">
        <Flex paddingBottom={3} borderBottom="1px solid" borderColor="gray.200">
          <Flex
            gap={2}
            alignItems="center"
            color="red.600"
            cursor="pointer"
            onClick={() => router.push("/")}
          >
            <Box
              bg="red.600"
              p={2}
              borderRadius="md"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon color="white" fontSize="2xl">
                <PiBowlFoodFill />
              </Icon>
            </Box>
            <VStack gap={0} align="start">
              <Heading size="md" color="red.600" fontWeight="bold">
                iComida
              </Heading>
              <Text fontSize="xs" color="gray.500">
                Painel Admin
              </Text>
            </VStack>
          </Flex>
        </Flex>

        {/* Menu Items */}
        <VStack gap={2} align="stretch">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Box
                key={item.path}
                onClick={() => router.push(item.path)}
                cursor="pointer"
                bg={isActive ? "red.50" : "transparent"}
                color={isActive ? "red.600" : "gray.700"}
                px={4}
                py={3}
                borderRadius="md"
                fontWeight={isActive ? "semibold" : "normal"}
                transition="all 0.2s"
                _hover={{
                  bg: isActive ? "red.50" : "gray.50",
                }}
              >
                <Flex align="center" gap={3}>
                  <Icon fontSize="xl">
                    <item.icon />
                  </Icon>
                  <Text>{item.label}</Text>
                </Flex>
              </Box>
            );
          })}
        </VStack>
      </VStack>

      {/* User Profile & Logout */}
      <VStack gap={3} align="stretch">
        <Flex direction="column" bg="gray.50" p={3} borderRadius="md" gap={1}>
          <Text fontSize="sm" fontWeight="semibold" color="gray.800">
            {user?.email?.split("@")[0] || "Usuário"}
          </Text>
          <Text fontSize="xs" color="gray.500" truncate>
            {user?.email}
          </Text>
        </Flex>

        <Button
          variant="outline"
          colorScheme="red"
          onClick={handleLogout}
          width="full"
          justifyContent="flex-start"
          gap={2}
        >
          <Icon>
            <LuLogOut />
          </Icon>
          Sair
        </Button>
      </VStack>
    </Flex>
  );
}
