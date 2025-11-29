"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./AuthProvider";

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider>
        <AuthProvider>{props.children}</AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
