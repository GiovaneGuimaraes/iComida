/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Box,
  Heading,
  Text,
  Input,
  VStack,
  Grid,
  Card,
  Image,
  Flex,
  Tabs,
  Spinner,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import * as React from "react";
import { Category, useStores } from "../hooks/useStores";
import { StoreCard } from "./components/ui/StoreCard";

const categories = Object.values(Category);

interface Store {
  id: number;
  name: string;
  image_path: string;
  category: string;
  user_id: string;
  product_list: any[];
  created_at: string;
}

const mockRestaurants: Store[] = [
  {
    id: 999,
    name: "Pizza Place",
    image_path:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    category: Category.PIZZA,
    user_id: "",
    product_list: [],
    created_at: new Date().toISOString(),
  },
  {
    id: 998,
    name: "Burger Joint",
    image_path:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    category: Category.BURGER,
    user_id: "",
    product_list: [],
    created_at: new Date().toISOString(),
  },
  {
    id: 997,
    name: "Sushi Bar",
    image_path:
      "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600",
    category: Category.JAPANESE,
    user_id: "",
    product_list: [],
    created_at: new Date().toISOString(),
  },
];

export default function Page() {
  const { fetchStores } = useStores();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [stores, setStores] = React.useState<Store[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [filteredRestaurants, setFilteredRestaurants] = React.useState<any[]>(
    []
  );

  // Fetch stores from Supabase
  React.useEffect(() => {
    const fetchStoresData = async () => {
      try {
        const fetchedStores = await fetchStores();
        // Combinar stores do banco com mocks
        const allStores = [...fetchedStores, ...mockRestaurants];
        setStores(allStores);
        setFilteredRestaurants(allStores);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoresData();
  }, []);

  // Filter by search term
  React.useEffect(() => {
    if (searchTerm !== "") {
      const filtered = stores.filter((store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(stores);
    }
  }, [searchTerm, stores]);

  return (
    <Box width="100%">
      {/* Hero Section */}
      <VStack gap={6} py={12} px={4}>
        <Heading
          size="3xl"
          textAlign="center"
          fontWeight="bold"
          maxW="800px"
          lineHeight="1.2"
        >
          Peça comida das suas lojas favoritas
        </Heading>

        <Text fontSize="lg" color="gray.600" textAlign="center">
          Centenas de restaurantes e lojas à sua disposição
        </Text>

        {/* Search Bar */}
        <Box width="100%" maxW="700px" mt={4} position="relative">
          <Box
            position="absolute"
            left={4}
            top="50%"
            transform="translateY(-50%)"
            zIndex={1}
            color="gray.500"
          >
            <LuSearch size={20} />
          </Box>
          <Input
            placeholder="Buscar lojas ou produtos..."
            size="lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            bg="white"
            borderRadius="full"
            boxShadow="md"
            border="1px solid"
            borderColor="gray.200"
            pl={12}
          />
        </Box>
      </VStack>

      {/* Categories Tabs */}
      <Flex
        borderTop="1px solid"
        borderBottom="1px solid"
        borderColor="gray.200"
        borderRadius="lg"
        bg="white"
        py={2}
        px={4}
      >
        <Tabs.Root
          defaultValue={Category.ALL}
          variant="plain"
          colorPalette="red"
          fitted={false}
          width="full"
        >
          <Tabs.List flexWrap="wrap">
            {categories.map((category) => (
              <Tabs.Trigger
                key={category}
                value={category}
                px={6}
                py={2}
                borderRadius="lg"
                fontWeight="medium"
                _selected={{
                  bg: "red.600",
                  color: "white",
                }}
              >
                {category}
              </Tabs.Trigger>
            ))}
            <Tabs.Indicator rounded="full" />
          </Tabs.List>

          {categories.map((category) => (
            <Tabs.Content key={category} value={category}>
              {/* Restaurants Section */}
              <Box maxW="1400px" mx="auto" px={4} py={12}>
                <Heading size="2xl" mb={8}>
                  Restaurantes
                </Heading>

                {loading ? (
                  <Flex justify="center" align="center" minH="300px">
                    <Spinner size="xl" color="red.600" />
                  </Flex>
                ) : (
                  <Grid
                    templateColumns={{
                      base: "1fr",
                      md: "repeat(2, 1fr)",
                      lg: "repeat(3, 1fr)",
                    }}
                    gap={6}
                  >
                    {filteredRestaurants
                      .filter(
                        (restaurant) =>
                          category === Category.ALL ||
                          restaurant.category === category
                      )
                      .map((restaurant) => (
                        <StoreCard
                          key={restaurant.id}
                          name={restaurant.name}
                          image_path={restaurant.image_path}
                          category={restaurant.category}
                        />
                      ))}
                    {filteredRestaurants.filter(
                      (restaurant) =>
                        category === Category.ALL ||
                        restaurant.category === category
                    ).length === 0 && (
                      <Text fontSize="md" color="gray.500">
                        Nenhum restaurante encontrado
                      </Text>
                    )}
                  </Grid>
                )}
              </Box>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Flex>
    </Box>
  );
}
