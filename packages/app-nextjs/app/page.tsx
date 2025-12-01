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
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import * as React from "react";

const categories = [
  "Todas",
  "Pizza",
  "Hambúrguer",
  "Japonês",
  "Mexicano",
  "Italiana",
  "Sobremesas",
];

const restaurants = [
  {
    id: 1,
    name: "Pizza Place",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600",
    category: "Pizza",
  },
  {
    id: 2,
    name: "Burger Joint",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600",
    category: "Hambúrguer",
  },
  {
    id: 3,
    name: "Sushi Bar",
    image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600",
    category: "Japonês",
  },
];

export default function Page() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredRestaurants, setFilteredRestaurants] =
    React.useState(restaurants);

  React.useEffect(() => {
    if (searchTerm !== "") {
      const filtered = restaurants.filter((restaurant) =>
        restaurant.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredRestaurants(filtered);
    } else {
      setFilteredRestaurants(restaurants);
    }
  }, [searchTerm]);

  console.log({ filteredRestaurants });

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
          defaultValue="Todas"
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
                        category === "Todas" || restaurant.category === category
                    )
                    .map((restaurant) => (
                      <Card.Root
                        key={restaurant.id}
                        overflow="hidden"
                        cursor="pointer"
                        transition="all 0.3s"
                        _hover={{
                          transform: "translateY(-4px)",
                          boxShadow: "xl",
                        }}
                      >
                        <Image
                          src={restaurant.image}
                          alt={restaurant.name}
                          height="250px"
                          objectFit="cover"
                          width="100%"
                        />
                        <Card.Body>
                          <Flex justify="space-between" align="center">
                            <Heading size="lg">{restaurant.name}</Heading>
                            <Text
                              fontSize="sm"
                              color="gray.600"
                              bg="gray.100"
                              px={3}
                              py={1}
                              borderRadius="full"
                            >
                              {restaurant.category}
                            </Text>
                          </Flex>
                        </Card.Body>
                      </Card.Root>
                    ))}
                  {filteredRestaurants.filter(
                    (restaurant) =>
                      category === "Todas" || restaurant.category === category
                  ).length === 0 && (
                    <Text fontSize="md" color="gray.500">
                      Nenhum restaurante encontrado
                    </Text>
                  )}
                </Grid>
              </Box>
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </Flex>
    </Box>
  );
}
