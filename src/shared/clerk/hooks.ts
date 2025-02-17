import { useSignIn, useClerk, useSignUp } from "@clerk/nextjs";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useClerkSignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signUp: clerkSignUp, isLoaded } = useSignUp();
  const { setActive } = useClerk();
  const router = useRouter();

  const signUp = async (email: string, password: string) => {
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      await clerkSignUp.create({
        emailAddress: email,
        password: password,
      });
      await clerkSignUp.prepareEmailAddressVerification();

      showNotification({
        title: "Спасибо за регистрацию!",
        message:
          "Проверьте свою электронную почту на наличие ссылки для подтверждения.",
        color: "green",
      });
    } catch (error) {
      showNotification({
        title: "Не удалось зарегистрироваться",
        message: "Попробуйте ещё раз",
        color: "red",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const verify = async (code: string) => {
    if (!isLoaded) return;

    setIsLoading(true);

    try {
      const result = await clerkSignUp.attemptVerification({
        code: code,
        strategy: "email_code",
      });

      if (result.status === "complete") {
        setActive({ session: result.createdSessionId });
        router.push("/cabinet");
      }
    } catch (error) {
      showNotification({
        title: "Не удалось подтвердить почту",
        message: "Попробуйте ещё раз",
        color: "red",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { signUp, verify, isLoaded, isLoading };
};

export const useClerkSignIn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { signIn: clerkSignIn, isLoaded } = useSignIn();
  const { setActive } = useClerk();
  const router = useRouter();

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const result = await clerkSignIn?.create({
        identifier: email,
        password,
      });
      if (result?.status === "complete") {
        setActive({ session: result.createdSessionId });
        router.push("/cabinet");
      }
    } catch (error) {
      showNotification({
        title: "Ошибка при входе",
        message: "Проверьте почту и пароль и попробуйте снова.",
        color: "red",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { signIn, isLoaded, isLoading };
};
