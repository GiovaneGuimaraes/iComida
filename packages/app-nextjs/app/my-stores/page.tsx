"use client";

import {
  Box,
  Heading,
  Text,
  Grid,
  Card,
  Image,
  Flex,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { useAuth } from "../../hooks/useAuth";
import { useStores, Category } from "../../hooks/useStores";
import * as React from "react";
import { StoreCard } from "../components/ui/StoreCard";

export default function Page() {
  const { user } = useAuth();
  const { fetchStores } = useStores();
  const [myStores, setMyStores] = React.useState<
    {
      id: number;
      name: string;
      image_path: string;
      category: Category;
      user_id: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      product_list: any[];
      created_at: string;
    }[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserStores = async () => {
      setLoading(true);
      try {
        const allStores = await fetchStores();
        const userStores = allStores.filter(
          (store) => store.user_id === user?.id
        );
        setMyStores(userStores);
      } catch (error) {
        setMyStores([]);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchUserStores();
    }
  }, [user]);

  return (
    <Box width="100%">
      <VStack gap={6} py={12} px={4}>
        <Heading
          size="2xl"
          textAlign="center"
          fontWeight="bold"
          maxW="800px"
          lineHeight="1.2"
        >
          Minhas Lojas
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          Veja os restaurantes que você cadastrou
        </Text>
      </VStack>

      <Flex
        maxW="1400px"
        mx="auto"
        px={4}
        py={8}
        bg="white"
        borderRadius="lg"
        justifyContent="center"
      >
        {loading ? (
          <Flex justify="center" align="center" minH="300px">
            <Spinner size="xl" color="red.600" />
          </Flex>
        ) : myStores.length === 0 ? (
          <Text fontSize="md" color="gray.500" textAlign="center">
            Você ainda não cadastrou nenhuma loja.
          </Text>
        ) : (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {myStores.map((store) => (
              <StoreCard
                key={store.id}
                name={store.name}
                image_path={store.image_path}
                category={store.category}
                isMyStorePage={true}
              />
            ))}
          </Grid>
        )}
      </Flex>
    </Box>
  );
}
