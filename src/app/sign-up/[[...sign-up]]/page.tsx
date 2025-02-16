import { Flex } from "@mantine/core";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <Flex h="100vh" align="center" justify="center">
      <SignUp />
    </Flex>
  );
}
