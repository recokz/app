import { Title } from "@mantine/core";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function ReconcilationPage({ searchParams }: Props) {
  return (
    <div>
      <Title order={3} mb={20}>
        Сверить транзакции {searchParams.id}
      </Title>
    </div>
  );
}
