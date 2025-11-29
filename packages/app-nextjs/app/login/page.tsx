"use client";

import {
  Box,
  Button,
  Card,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Field } from "@chakra-ui/react";
import { useState } from "react";
import { PasswordInput } from "../components/ui/password-input";
import { toaster, Toaster } from "../components/ui/toaster";
import { client } from "../../api/client";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    const email = formData.email;
    const password = formData.password;

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Sign in response:", { data, error });
    if (data.user) {
      toaster.create({
        title: "Success",
        description: "Login realizado com sucesso! redirecionando...",
        type: "success",
        closable: true,
      });

      setTimeout(() => {
        router.push("/");
      }, 1000);
    }

    if (error) {
      toaster.create({
        title: "Error",
        description: `Erro ao fazer login: ${error.message} - Tente novamente.`,
        type: "error",
        closable: true,
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100%"
      py={8}
    >
      <Toaster />
      <Card.Root maxW="md" width="100%" p={8} boxShadow="xl">
        <Card.Header>
          <Heading size="xl" textAlign="center" color="orange.700">
            Login
          </Heading>
          <Text textAlign="center" color="gray.600" mt={2}>
            Preencha os dados para fazer login
          </Text>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Field.Root required>
                <Field.Label>Email</Field.Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  size="lg"
                />
              </Field.Root>

              <Field.Root required>
                <Field.Label>Senha</Field.Label>
                <PasswordInput
                  name="password"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleChange}
                  size="lg"
                />
              </Field.Root>

              <Button
                type="submit"
                colorScheme="orange"
                size="lg"
                width="100%"
                mt={4}
              >
                Entrar
              </Button>
            </Stack>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
