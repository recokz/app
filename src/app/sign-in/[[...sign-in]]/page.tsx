import { Flex } from "@mantine/core";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <Flex h="100vh" align="center" justify="center">
      <SignIn />
    </Flex>
  );
}
