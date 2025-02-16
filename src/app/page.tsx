import { Flex, Skeleton, Title } from "@mantine/core";
import { Suspense } from "react";
import { TryButton } from "@/features/try-button";

export default function Home() {
  return (
    <Flex h="100vh" align="center" justify="center" direction="column" gap="xl">
      <Title order={1} textWrap="balance" fw="normal" ta="center">
        Добро пожаловать в приложение для <br />
        <strong>сверки</strong> продаж и выписок!
      </Title>
      <Suspense fallback={<Skeleton height={50} w={170} />}>
        <TryButton />
      </Suspense>
    </Flex>
  );
}
