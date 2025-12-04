"use client";

import { Flex } from "@chakra-ui/react";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      width="full"
      minHeight="100vh"
      px={8}
      py={8}
      justifyContent={"center"}
      bgColor="gray.muted"
    >
      {children}
    </Flex>
  );
}
