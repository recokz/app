import {
  ActionIcon,
  TableTh,
  Title,
  Text,
  TableThead,
  Badge,
} from "@mantine/core";
import { TableTd } from "@mantine/core";
import { EmptyReportsInProgress } from "./empty-states";
import { TableTbody, TableTr } from "@mantine/core";
import { EmptyReports } from "./empty-states";
import { Stack, Table } from "@mantine/core";
import { reportsTabCache } from "./search-params";
import { EmptyReportsDone } from "./empty-states";
import { IconPencilMinus } from "@tabler/icons-react";
import Link from "next/link";
import { ReportsTableTabs } from "./tabs";
import { prisma } from "@/shared/prisma/prisma";
import { ReportStatus } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import dayjs from "dayjs";

export async function ReportsTable() {
  const user = await currentUser();
  if (!user) {
    throw new Error("Ошибка с авторизацией, попробуйте перезайти в систему");
  }

  const tab = reportsTabCache.get("tab");

  const reports = await prisma.report.findMany({
    where: {
      organizationId: user.privateMetadata.organizationId as string,
    },
  });

  const allCount = reports?.length || 0;
  let inProgressCount = 0;
  let doneCount = 0;

  reports?.forEach((item) => {
    if (item.status !== ReportStatus.done) inProgressCount++;
    if (item.status === ReportStatus.done) doneCount++;
  });

  const displayedReports =
    reports?.filter((item) => {
      if (tab === "all") return true;
      if (tab === "in_progress") return item.status !== ReportStatus.done;
      if (tab === "done") return item.status === ReportStatus.done;
    }) || [];

  return (
    <Stack gap={32}>
      <Stack>
        <div>
          <Title order={3}>Все сверки</Title>
          <Text c="dark.3">
            {allCount} всего, {inProgressCount} в работе, {doneCount}{" "}
            завершенные
          </Text>
        </div>
        <ReportsTableTabs />
      </Stack>

      {displayedReports.length > 0 && (
        <Table highlightOnHover withTableBorder>
          <TableThead>
            <TableTr>
              <TableTh>Дата</TableTh>
              <TableTh>Сумма</TableTh>
              <TableTh w={200}>Статус</TableTh>
              <TableTh w={100}></TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            {displayedReports.map((item, index) => (
              <TableTr key={index}>
                <TableTd>{dayjs(item.startDate).format("DD.MM.YYYY")}</TableTd>
                <TableTd>{item.cashBalance}</TableTd>
                <TableTd>
                  {item.status !== ReportStatus.done ? (
                    <Badge variant="light" color="blue" size="lg" radius="xs">
                      В работе
                    </Badge>
                  ) : (
                    <Badge variant="light" color="green" size="lg" radius="xs">
                      Завершен
                    </Badge>
                  )}
                </TableTd>
                <TableTd align="right">
                  <ActionIcon
                    component={Link}
                    href={`/cabinet/${item.id}`}
                    variant="transparent"
                  >
                    <IconPencilMinus color="var(--mantine-color-dark-3)" />
                  </ActionIcon>
                </TableTd>
              </TableTr>
            ))}
          </TableTbody>
        </Table>
      )}
      {!allCount && tab === "all" && <EmptyReports />}
      {!inProgressCount && tab === "in_progress" && <EmptyReportsInProgress />}
      {!doneCount && tab === "done" && <EmptyReportsDone />}
    </Stack>
  );
}
