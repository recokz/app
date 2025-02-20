"use client";

import { getReport, updateReport } from "@/entities/reports/actions/report";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Box,
  Flex,
  Badge,
  Loader,
  LoadingOverlay,
  Table,
  TableTbody,
  TableTd,
  TableTh,
  TableThead,
  TableTr,
  Text,
  UnstyledButton,
  Title,
  Select,
} from "@mantine/core";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import {
  getTransactionTypes,
  updateTransactionType,
} from "@/entities/reports/actions/document";
import { ReportStatus } from "@prisma/client";

export function ExpensesForm() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: report, isLoading: isReportLoading } = useQuery({
    queryKey: ["report", params.id],
    queryFn: () => getReport(params.id),
  });

  const { data: transactionTypes, isLoading: isTransactionTypesLoading } =
    useQuery({
      queryKey: ["transaction-types"],
      queryFn: () => getTransactionTypes("expenses"),
    });

  const allTransactions = report?.bankDocuments
    .flatMap((document) => document.transactions)
    .filter((transaction) => transaction.amount < 0)
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

  const handleUpdateTransactionType = async (
    transactionId: string,
    typeId: string | null
  ) => {
    await updateTransactionType(transactionId, typeId);
    queryClient.invalidateQueries({ queryKey: ["report", params.id] });
  };

  const handleNextStep = async () => {
    await updateReport(params.id, {
      status: ReportStatus.DONE,
      cashBalance: report!.cashBalance,
      date: report!.date,
    });
    queryClient.invalidateQueries({ queryKey: ["report", params.id] });
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isReportLoading || isTransactionTypesLoading}
        loaderProps={{ children: <Loader color="blue" /> }}
      />

      <Flex gap={12}>
        <UnstyledButton
          bg={"indigo.0"}
          py={8}
          px={12}
          miw={220}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            borderRadius: "8px",
            border: "1px solid var(--mantine-color-indigo-4)",
          }}
        >
          <Text>Всего</Text>
          <Title order={3}>
            {allTransactions
              ?.reduce((acc, transaction) => acc + transaction.amount, 0)
              .toLocaleString("ru-RU")}
          </Title>
        </UnstyledButton>
      </Flex>

      <Table>
        <TableThead>
          <TableTr>
            <TableTh>Дата</TableTh>
            <TableTh>Время</TableTh>
            <TableTh>Сумма</TableTh>
            <TableTh>Статус</TableTh>
            <TableTh>Действия</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          {allTransactions?.map((row) => (
            <TableTr key={row.id}>
              <TableTd style={{ whiteSpace: "nowrap" }}>
                {dayjs(row.date).format("DD.MM.YYYY")}
              </TableTd>
              <TableTd style={{ whiteSpace: "nowrap" }}>
                {dayjs(row.date).format("HH:mm")}
              </TableTd>
              <TableTd style={{ whiteSpace: "nowrap" }}>{row.amount}</TableTd>
              <TableTd style={{ whiteSpace: "nowrap" }}>
                {row.crmDocument || row.type ? (
                  <Badge variant="light" color="blue" size="lg" radius="xs">
                    Подтвержден
                  </Badge>
                ) : (
                  <Badge variant="light" color="yellow" size="lg" radius="xs">
                    Неподтвержден
                  </Badge>
                )}
              </TableTd>
              <TableTd style={{ whiteSpace: "nowrap" }}>
                <Select
                  variant="unstyled"
                  value={row.type?.id}
                  onChange={(value) => {
                    handleUpdateTransactionType(row.id, value);
                  }}
                  data={transactionTypes?.map((type) => ({
                    value: type.id,
                    label: type.name,
                  }))}
                />
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>
      <Flex pt={20} justify="end" gap={8}>
        <Button size="lg" onClick={handleNextStep}>
          Следующий шаг
        </Button>
      </Flex>
    </Box>
  );
}
