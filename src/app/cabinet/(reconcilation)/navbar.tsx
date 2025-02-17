import {
  AppShellNavbar,
  Box,
  Button,
  Stack,
  Timeline,
  TimelineItem,
  Title,
  Text,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconChecklist,
  IconCurrencyDollar,
  IconReportMoney,
  IconUpload,
} from "@tabler/icons-react";
import Link from "next/link";

export function ReconcileNavbar() {
  return (
    <AppShellNavbar p="md">
      <Stack justify="space-between" h="100%">
        <Stack gap={40}>
          <Title order={3} c="blue">
            Reconcile
          </Title>

          <Box p={10} pr={20}>
            <Timeline active={0}>
              <TimelineItem bullet={<IconUpload />} title="Импорт">
                <Text size="sm" c="dimmed">
                  Загрузите выписки из банка и данные о продажах.
                </Text>
                <Text size="xs" mt={4}>
                  5 мин
                </Text>
              </TimelineItem>
              <TimelineItem bullet={<IconChecklist />} title="Продажи">
                <Text size="sm" c="dimmed">
                  Сверьте продажи с транзакциями и подтвердите неподтвержденные.
                </Text>
                <Text size="xs" mt={4}>
                  5 мин
                </Text>
              </TimelineItem>
              <TimelineItem
                bullet={<IconCurrencyDollar />}
                title="Прочие поступления"
              >
                <Text size="sm" c="dimmed">
                  Укажите источник доходов, отсутствующих в системе.
                </Text>
                <Text size="xs" mt={4}>
                  5 мин
                </Text>
              </TimelineItem>
              <TimelineItem bullet={<IconReportMoney />} title="Расходы">
                <Text size="sm" c="dimmed">
                  Подтвердите назначения расходов, зафиксированных в банке.
                </Text>
                <Text size="xs" mt={4}>
                  5 мин
                </Text>
              </TimelineItem>
            </Timeline>
          </Box>
        </Stack>
        <Box>
          <Button
            component={Link}
            href="/cabinet"
            variant="subtle"
            leftSection={<IconArrowLeft />}
          >
            Все сделки
          </Button>
        </Box>
      </Stack>
    </AppShellNavbar>
  );
}
