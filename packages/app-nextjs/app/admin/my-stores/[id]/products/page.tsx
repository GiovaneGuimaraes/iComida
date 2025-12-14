"use client";

import {
  Button,
  Card,
  Flex,
  Grid,
  Heading,
  Text,
  Box,
  Skeleton,
} from "@chakra-ui/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import * as React from "react";
import { useProducts } from "../../../../../hooks/useProducts";
import { useStores } from "../../../../../hooks/useStores";
import { IoMdAdd, IoMdArrowRoundBack } from "react-icons/io";
import { ProductCard } from "../../../../components/ui/ProductCard";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const { fetchProducts, products, loading } = useProducts();
  const { fetchStores } = useStores();
  const [storeName, setStoreName] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const stores = await fetchStores();
      const store = stores.find((s) => s.id === Number(id));
      if (store) {
        setStoreName(store.name);
      }
      await fetchProducts(Number(id));
    };
    loadData();
  }, [id]);

  const handleDeleteSuccess = () => {
    fetchProducts(Number(id));
  };

  const loadingContent = React.useMemo(
    () => (
      <Flex width="full" flexDirection="column">
        <Flex
          width="full"
          py={12}
          px={4}
          gap={4}
          justifyContent="space-between"
          flexDirection={["column", "column", "row"]}
          alignItems="center"
          flexWrap="wrap"
        >
          <Flex alignItems="center" gap={4}>
            <Button
              variant="solid"
              size="xs"
              colorPalette="red"
              onClick={() => router.back()}
              display={["none", "none", "flex"]}
            >
              <IoMdArrowRoundBack />
            </Button>
            <Box>
              <Heading size="2xl" fontWeight="bold" lineHeight="1.5">
                Produtos - {storeName}
              </Heading>
              <Text fontSize="lg" color="gray.600" mt={1}>
                Gerencie os produtos da sua loja
              </Text>
            </Box>
          </Flex>
        </Flex>

        <Flex mx="auto" width="full" px={4}>
          <Grid
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap={6}
            width="full"
            justifyItems="start"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                width="350px"
                height="400px"
                borderRadius="lg"
              />
            ))}
          </Grid>
        </Flex>
      </Flex>
    ),
    [router, storeName]
  );

  if (loading && storeName === "") {
    return loadingContent;
  }

  return (
    <Flex width="full" flexDirection="column">
      <Flex
        width="full"
        py={12}
        px={4}
        gap={4}
        justifyContent="space-between"
        flexDirection={["column", "column", "row"]}
        alignItems="center"
        flexWrap="wrap"
      >
        <Flex alignItems="center" gap={4}>
          <Button
            variant="solid"
            size="xs"
            colorPalette="red"
            onClick={() => router.back()}
            display={["none", "none", "flex"]}
          >
            <IoMdArrowRoundBack />
          </Button>
          <Box>
            <Heading size="2xl" fontWeight="bold" lineHeight="1.5">
              Produtos - {storeName}
            </Heading>
            <Text fontSize="lg" color="gray.600" mt={1}>
              Gerencie os produtos da sua loja
            </Text>
          </Box>
        </Flex>
        <Button
          variant="solid"
          colorPalette="red"
          onClick={() =>
            router.push(`/admin/my-stores/${id}/products/add-product`)
          }
        >
          <IoMdAdd /> Adicionar Produto
        </Button>
      </Flex>

      <Flex mx="auto" width="full" px={4}>
        {products.length === 0 ? (
          <Grid
            templateColumns="repeat(auto-fill, minmax(300px, 1fr))"
            gap={6}
            width="full"
            justifyItems="start"
          >
            <Card.Root
              onClick={() =>
                router.push(`/admin/my-stores/${id}/products/add-product`)
              }
              cursor="pointer"
              width="350px"
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
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.metadata.price}
                image={product.image}
                active={product.active}
                storeId={Number(id)}
                onDeleteSuccess={handleDeleteSuccess}
              />
            ))}
          </Grid>
        )}
      </Flex>
    </Flex>
  );
}
