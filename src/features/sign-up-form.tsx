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
import {
  emailValidator,
  passwordValidator,
  xinValidator,
} from "@/shared/libs/validators";
import { useClerkSignUp } from "@/shared/clerk/hooks";
import { useState } from "react";

export function SignUpForm() {
  const [pendingVerification, setPendingVerification] = useState(false);

  return !pendingVerification ? (
    <SignUp onSuccess={() => setPendingVerification(true)} />
  ) : (
    <Verify />
  );
}

const formSchema = z.object({
  email: emailValidator,
  password: passwordValidator,
});

function SignUp({ onSuccess }: { onSuccess: () => void }) {
  const { signUp, isLoaded, isLoading } = useClerkSignUp();

  const form = useForm({
    mode: "uncontrolled",
    validate: zodResolver(formSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!isLoaded) return;
    await signUp(values.email, values.password);
    onSuccess();
  };

  return (
    <Flex direction="column" gap={36} align="center">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Flex direction="column" gap={32} maw="600px">
          <Flex direction="column" gap={12} align="center">
            <Title order={2} ta="center">
              Зарегистрироваться
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              Управляйте платежами онлайн. Добавляйте документы к сравнению,
              формируйте и экспортируйте отчёты за 5 минут
            </Text>
          </Flex>

          <Flex direction="column" gap={12}>
            <TextInput
              {...form.getInputProps("email")}
              size="lg"
              placeholder="Ваша почта"
              name="email"
              rightSection={<IconAt size={16} />}
              autoComplete="off"
            />
            <PasswordInput
              {...form.getInputProps("password")}
              size="lg"
              name="password"
              placeholder="Ваш пароль"
              type="password"
              autoComplete="off"
            />

            <div id="clerk-captcha"></div>
          </Flex>

          <Flex justify="space-between" align="center" gap={12}>
            <Text size="sm" c="dimmed">
              Нажимая кнопку “зарегистрироваться”, вы
              <br /> соглашаетесь с Политикой конфиденциальности
            </Text>
            <Button
              type="submit"
              size="lg"
              loading={isLoading}
              disabled={!isLoaded}
            >
              Зарегистрироваться
            </Button>
          </Flex>
        </Flex>
      </form>

      <Text size="md">
        Есть аккаунт?{" "}
        <Text c="blue" component={Link} href="/sign-in">
          Войти
        </Text>
      </Text>
    </Flex>
  );
}

const verifyFormSchema = z.object({
  name: z.string({ message: "Обязательное поле" }),
  code: z.string({ message: "Обязательное поле" }),
  xin: xinValidator,
});

function Verify() {
  const { verify, isLoaded, isLoading } = useClerkSignUp();

  const form = useForm({
    mode: "uncontrolled",
    validate: zodResolver(verifyFormSchema),
  });

  const handleVerify = async (values: typeof form.values) => {
    if (!isLoaded) return;

    await verify(values.name, values.xin, values.code);
  };

  return (
    <Flex direction="column" gap={36} align="center">
      <form onSubmit={form.onSubmit(handleVerify)}>
        <Flex direction="column" gap={32} maw="600px">
          <Flex direction="column" gap={12} align="center">
            <Title order={2} ta="center">
              Данные компании
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              Управляйте платежами онлайн. Добавляйте документы к сравнению,
              формируйте и экспортируйте отчёты за 5 минут
            </Text>
          </Flex>

          <Flex direction="column" gap={12}>
            <TextInput
              {...form.getInputProps("name")}
              size="lg"
              placeholder="Название организации"
              name="name"
              autoComplete="off"
            />
            <TextInput
              {...form.getInputProps("xin")}
              size="lg"
              placeholder="ИИН/БИН"
              name="xin"
              autoComplete="off"
            />
            <TextInput
              {...form.getInputProps("code")}
              size="lg"
              placeholder="Введите код, отправленный на вашу электронную почту"
              name="code"
              autoComplete="off"
            />
          </Flex>

          <Flex justify="space-between" align="center" gap={12}>
            <Text size="sm" c="dimmed"></Text>
            <Button
              type="submit"
              size="lg"
              loading={isLoading}
              disabled={!isLoaded}
            >
              Подтвердить
            </Button>
          </Flex>
        </Flex>
      </form>

      <Text size="md">
        Есть аккаунт?{" "}
        <Text c="blue" component={Link} href="/sign-in">
          Войти
        </Text>
      </Text>
    </Flex>
  );
}
