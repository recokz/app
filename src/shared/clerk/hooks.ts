import { useSignIn, useClerk } from "@clerk/nextjs";
import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
