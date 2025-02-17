import { Flex } from "@mantine/core";
import { SignUpForm } from "@/features/sign-up-form";

export default function Page() {
  return (
    <Flex h="100vh" align="center" justify="center">
      <SignUpForm />
    </Flex>
  );
}
