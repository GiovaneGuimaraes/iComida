"use client";

import { Inter } from "next/font/google";
import Provider from "./provider/Provider";
import Header from "./components/ui/Header";
import Main from "./components/ui/Main";
import { usePathname } from "next/navigation";
import Sidebar from "./components/ui/Sidebar";
import { Flex } from "@chakra-ui/react";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  return (
    <html className={inter.className} suppressHydrationWarning>
      <head />
      <body>
        <Provider>
          {!pathname.includes("/admin") ? <Header /> : <Sidebar />}
          <Main>
            <Flex
              width="full"
              height="full"
              ml={!pathname.includes("/admin") ? "0" : ["0", "0", "280px"]}
            >
              {children}
            </Flex>
          </Main>
        </Provider>
      </body>
    </html>
  );
}
