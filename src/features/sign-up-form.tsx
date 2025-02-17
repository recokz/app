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
import { showNotification } from "@mantine/notifications";
import { z } from "zod";
import Link from "next/link";
import { emailValidator, passwordValidator } from "@/shared/libs/validators";
import { useSignUp } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
const formSchema = z.object({
  email: emailValidator,
  password: passwordValidator,
});

export function SignUpForm() {
  const router = useRouter();
  const { signUp, isLoaded } = useSignUp();
  const [pendingVerification, setPendingVerification] = useState(false);

  const form = useForm({
    mode: "uncontrolled",
    validate: zodResolver(formSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress: values.email,
        password: values.password,
      });
      await signUp.prepareEmailAddressVerification();

      showNotification({
        title: "Спасибо за регистрацию!",
        message:
          "Проверьте свою электронную почту на наличие ссылки для подтверждения.",
        color: "green",
      });
      setPendingVerification(true);
    } catch (error) {
      showNotification({
        title: "Не удалось зарегистрироваться",
        message: "Попробуйте ещё раз",
        color: "red",
      });
      console.error(error);
    }
  };

  const handleVerify = async (values: typeof form.values) => {
    if (!isLoaded) return;

    try {
      const result = await signUp.attemptVerification({
        code: values.code,
        strategy: "email_code",
      });
      if (result.status === "complete") {
        router.push("/cabinet");
      }
      console.log(result);
    } catch (error) {
      showNotification({
        title: "Не удалось подтвердить почту",
        message: "Попробуйте ещё раз",
        color: "red",
      });
      console.error(error);
    }
  };

  return !pendingVerification ? (
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
          </Flex>

          <Flex justify="space-between" align="center" gap={12}>
            <Text size="sm" c="dimmed">
              Нажимая кнопку “зарегистрироваться”, вы
              <br /> соглашаетесь с Политикой конфиденциальности
            </Text>
            <Button type="submit" size="lg" disabled={!isLoaded}>
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
  ) : (
    <Flex direction="column" gap={36} align="center">
      <form onSubmit={form.onSubmit(handleVerify)}>
        <Flex direction="column" gap={32} maw="600px">
          <Flex direction="column" gap={12} align="center">
            <Title order={2} ta="center">
              Подтвердите свою почту
            </Title>
            <Text size="lg" c="dimmed" ta="center">
              Управляйте платежами онлайн. Добавляйте документы к сравнению,
              формируйте и экспортируйте отчёты за 5 минут
            </Text>
          </Flex>

          <Flex direction="column" gap={12}>
            <TextInput
              {...form.getInputProps("code")}
              size="lg"
              placeholder="Введите код, отправленный на вашу электронную почту"
              name="code"
              rightSection={<IconAt size={16} />}
              autoComplete="off"
            />
          </Flex>

          <Flex justify="space-between" align="center" gap={12}>
            <Text size="sm" c="dimmed"></Text>
            <Button type="submit" size="lg" disabled={!isLoaded}>
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
