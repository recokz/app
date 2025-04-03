"use client";

import {
  Button,
  Flex,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { IconAt } from "@tabler/icons-react";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import Link from "next/link";
import { emailValidator, passwordValidator } from "@/shared/libs/validators";
import { useClerkSignIn } from "@/shared/clerk/hooks";

const formSchema = z.object({
  email: emailValidator,
  password: passwordValidator,
});

export function SignInForm() {
  const { signIn, isLoaded, isLoading } = useClerkSignIn();

  const form = useForm({
    mode: "uncontrolled",
    validate: zodResolver(formSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!isLoaded) return;

    signIn(values.email, values.password);
  };

  return (
    <Flex direction="column" gap={36} align="center">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex direction="column" gap={32} maw="600px">
          <Flex direction="column" gap={12} align="center">
            <Title order={2} ta="center">
              Ваши документы всегда под рукой
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              Управляйте платежами онлайн. Добавляйте документы к сравнению,
              формируйте и экспортируйте отчёты за 5 минут
            </Text>
          </Flex>

          <Flex direction="column" gap={12}>
            <TextInput
              id="email"
              {...form.getInputProps("email")}
              size="lg"
              placeholder="Ваша почта"
              name="email"
              rightSection={<IconAt size={16} />}
              autoComplete="off"
            />
            <PasswordInput
              id="password"
              {...form.getInputProps("password")}
              size="lg"
              name="password"
              placeholder="Ваш пароль"
              type="password"
              autoComplete="off"
            />
          </Flex>

          <Flex justify="space-between" align="center" gap={12}>
            <div />
            <Button
              id="sign-in-submit"
              type="submit"
              size="lg"
              loading={isLoading}
              disabled={!isLoaded}
            >
              Войти
            </Button>
          </Flex>
        </Flex>
      </form>

      <Text size="md">
        Нет аккаунта?{" "}
        <Text c="blue" component={Link} href="/sign-up">
          Зарегистрироваться
        </Text>
      </Text>
    </Flex>
  );
}
