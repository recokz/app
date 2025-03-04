import { prisma } from "@/shared/prisma/prisma";
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
import { ReportStatus } from "@prisma/client";
import {
  IconArrowLeft,
  IconChecklist,
  IconReportMoney,
  IconUpload,
} from "@tabler/icons-react";
import Link from "next/link";

type Props = {
  id: string;
};

export async function ReconcileNavbar({ id }: Props) {
  const report = await prisma.report.findUnique({
    where: {
      id,
    },
  });

  let timelineStep = 0;

  switch (report?.status) {
    case ReportStatus.import_info:
    case ReportStatus.import_bank:
    case ReportStatus.import_crm:
      timelineStep = 0;
      break;
    case ReportStatus.sales:
      timelineStep = 1;
      break;
    case ReportStatus.expenses:
      timelineStep = 2;
      break;
    case ReportStatus.done:
      timelineStep = 3;
      break;
  }

  return (
    <AppShellNavbar p="md">
      <Stack justify="space-between" h="100%">
        <Stack gap={40}>
          <Title order={3} c="blue">
            Reconcile
          </Title>

          <Box p={10} pr={20}>
            <Timeline active={timelineStep}>
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
