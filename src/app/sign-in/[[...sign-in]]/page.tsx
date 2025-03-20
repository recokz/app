import { Flex } from "@mantine/core";
import { SignInForm } from "@/features/sign-in-form";

export default function Page() {
  return (
    <Flex h="100vh" align="center" justify="center">
      <SignInForm />
    </Flex>
  );
}
