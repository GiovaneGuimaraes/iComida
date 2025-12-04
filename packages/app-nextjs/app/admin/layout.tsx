import Sidebar from "../components/ui/Sidebar";
import { Flex } from "@chakra-ui/react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex width="full" height="full">
      <Sidebar />
      <Flex width="full" height="full" ml="280px">
        {children}
      </Flex>
    </Flex>
  );
}
