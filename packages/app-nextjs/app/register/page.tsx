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

    const email = formData.email;
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const name = formData.name;

    if (password !== confirmPassword) {
      toaster.create({
        title: "Error",
        description: "As senhas precisam ser iguais!",
        type: "error",
        closable: true,
      });
      return;
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (data.user) {
      toaster.create({
        title: "Success",
        description: "Conta criada com sucesso!",
        type: "success",
        closable: true,
      });

      router.push("/login");
    }

    if (error) {
      toaster.create({
        title: "Error",
        description: `Erro ao criar conta: ${error.message} - Tente novamente.`,
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
            Criar Conta
          </Heading>
          <Text textAlign="center" color="gray.600" mt={2}>
            Preencha os dados para se cadastrar
          </Text>
        </Card.Header>

        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Stack gap={4}>
              <Field.Root required>
                <Field.Label>Nome Completo</Field.Label>
                <Input
                  name="name"
                  placeholder="Digite seu nome completo"
                  value={formData.name}
                  onChange={handleChange}
                  size="lg"
                />
              </Field.Root>

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

              <Field.Root required>
                <Field.Label>Confirmar Senha</Field.Label>
                <PasswordInput
                  name="confirmPassword"
                  placeholder="Confirme sua senha"
                  value={formData.confirmPassword}
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
                Cadastrar
              </Button>
            </Stack>
          </form>
        </Card.Body>

        <Card.Footer>
          <Text textAlign="center" color="gray.600" width="100%">
            Já tem uma conta?{" "}
            <Text
              as="span"
              color="orange.600"
              fontWeight="bold"
              cursor="pointer"
              onClick={() => {
                router.push("/login");
              }}
            >
              Faça login
            </Text>
          </Text>
        </Card.Footer>
      </Card.Root>
    </Box>
  );
}
