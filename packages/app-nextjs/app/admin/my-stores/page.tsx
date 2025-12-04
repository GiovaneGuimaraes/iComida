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
    <Flex width="full" flexDirection="column">
      <Flex
        width="full"
        py={12}
        px={4}
        gap={[4, 4, 0]}
        justifyContent={["center", "center", "space-between"]}
        flexDirection={["column", "column", "row"]}
        alignItems="center"
        textAlign={["center", "center", "unset"]}
      >
        <Box gap={2}>
          <Heading
            size="2xl"
            justifyContent="flex-start"
            fontWeight="bold"
            lineHeight="1.5"
            width="full"
          >
            Minhas Lojas
          </Heading>
          <Text fontSize="lg" color="gray.600" width="full">
            Veja os restaurantes que você cadastrou
          </Text>
        </Box>
        <Box>
          <Button
            variant="solid"
            colorPalette="red"
            onClick={() => router.push("/admin/my-stores/add-store")}
          >
            <IoMdAdd />
            Nova Loja
          </Button>
        </Box>
      </Flex>

      <Flex maxW="1400px" mx="auto" justifyContent="center">
        {loading ? (
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {[...Array(6)].map((_, idx) => (
              <Card.Root key={idx}>
                <Skeleton height="400px" width="300px" borderRadius="lg" />
              </Card.Root>
            ))}
          </Grid>
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
                active={store.active}
                isMyStorePage={true}
              />
            ))}
          </Grid>
        )}
      </Flex>
    </Flex>
  );
}
