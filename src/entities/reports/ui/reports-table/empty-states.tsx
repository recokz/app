import { Stack, Text, Title } from "@mantine/core";
import { CreateReportButton } from "../../../../features/create-report";

export function EmptyReports() {
  return (
    <Stack pt={100} align="center" gap={32}>
      <Stack align="center" gap={8}>
        <Title order={2}>У вас пока нет сверок</Title>
        <Text c="dark.4" maw={460} ta="center">
          Все сверки появятся на этой странице, как только вы начнете работу с
          ними
        </Text>
      </Stack>
      <CreateReportButton />
    </Stack>
  );
}

export function EmptyReportsInProgress() {
  return (
    <Stack pt={100} align="center" gap={32}>
      <Stack align="center" gap={8}>
        <Title order={2}>У вас пока нет сверок в работе</Title>
        <Text c="dark.4" maw={460} ta="center">
          Все сверки появятся на этой странице, как только вы начнете работу с
          ними
        </Text>
      </Stack>
      <CreateReportButton />
    </Stack>
  );
}

export function EmptyReportsDone() {
  return (
    <Stack pt={100} align="center" gap={32}>
      <Stack align="center" gap={8}>
        <Title order={2}>У вас пока нет завершенных сверок</Title>
        <Text c="dark.4" maw={460} ta="center">
          Все сверки появятся на этой странице, как только вы начнете работу с
          ними
        </Text>
      </Stack>
    </Stack>
  );
}
