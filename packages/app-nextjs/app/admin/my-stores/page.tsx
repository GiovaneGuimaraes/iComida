"use client";

import {
  Box,
  Heading,
  Text,
  Grid,
  Flex,
  Button,
  Skeleton,
  Card,
} from "@chakra-ui/react";
import * as React from "react";
import { StoreCard } from "../../components/ui/StoreCard";
import { useAuth } from "../../../hooks/useAuth";
import { Store, useStores } from "../../../hooks/useStores";
import { IoMdAdd } from "react-icons/io";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user } = useAuth();
  const router = useRouter();
  const { fetchStores } = useStores();
  const [myStores, setMyStores] = React.useState<Store[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchUserStores = React.useCallback(async () => {
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
  }, [user?.id, fetchStores]);

  React.useEffect(() => {
    if (user?.id) {
      fetchUserStores();
    }
  }, [user, fetchUserStores]);

  return (
    <Flex width="full" flexDirection="column">
      <Flex
        width="full"
        py={8}
        px={4}
        gap={4}
        justifyContent="space-between"
        flexDirection={["column", "column", "row"]}
        alignItems="center"
        flexWrap="wrap"
      >
        <Box>
          <Heading size="2xl" fontWeight="bold" lineHeight="1.5">
            Minhas Lojas
          </Heading>
          <Text fontSize="lg" color="gray.600" mt={1}>
            Veja os restaurantes que você cadastrou
          </Text>
        </Box>
        <Button
          variant="solid"
          colorPalette="red"
          onClick={() => router.push("/admin/my-stores/add-store")}
        >
          <IoMdAdd />
          Nova Loja
        </Button>
      </Flex>

      <Flex mx="auto" width="full" px={4}>
        {loading ? (
          <Grid
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap={6}
            width="full"
            justifyItems="start"
          >
            {[...Array(6)].map((_, idx) => (
              <Skeleton
                key={idx}
                height="400px"
                width="300px"
                borderRadius="lg"
              />
            ))}
          </Grid>
        ) : myStores.length === 0 ? (
          <Grid
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap={6}
            width="full"
            justifyItems="start"
          >
            <Card.Root
              onClick={() => router.push("/admin/my-stores/add-store")}
              cursor="pointer"
              width="300px"
              minWidth="300px"
              maxWidth="300px"
              height="400px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderStyle="dashed"
              borderWidth="2px"
              borderColor="gray.300"
              borderRadius="md"
              _hover={{ bg: "gray.50" }}
            >
              <Flex
                textAlign="center"
                px={4}
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                fontSize="3xl"
                color="gray.400"
              >
                <IoMdAdd />
              </Flex>
            </Card.Root>
          </Grid>
        ) : (
          <Grid
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap={6}
            width="full"
            justifyItems="start"
          >
            {myStores.map((store) => (
              <StoreCard
                key={store.id}
                id={store.id}
                name={store.name}
                image_path={store.image_path}
                category={store.category}
                active={store.active}
                isMyStorePage={true}
                onDeleteSuccess={fetchUserStores}
              />
            ))}
          </Grid>
        )}
      </Flex>
    </Flex>
  );
}
