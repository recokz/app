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
import { useState } from "react";
import dayjs from "dayjs";
import {
  getTransactionTypes,
  updateTransactionType,
} from "@/entities/reports/actions/document";
import { ReportStatus } from "@prisma/client";
export function SalesForm() {
  const params = useParams<{ id: string }>();
  const [tab, setTab] = useState<"all" | "confirmed" | "unconfirmed">("all");
  const queryClient = useQueryClient();

  const { data: report, isLoading: isReportLoading } = useQuery({
    queryKey: ["report", params.id],
    queryFn: () => getReport(params.id),
  });

  const { data: transactionTypes, isLoading: isTransactionTypesLoading } =
    useQuery({
      queryKey: ["transaction-types"],
      queryFn: () => getTransactionTypes("sales"),
    });

  const allTransactions = report?.bankDocuments
    .flatMap((document) => document.transactions)
    .filter((transaction) => transaction.amount > 0)
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

  console.log(allTransactions);

  const confirmedTransactions = allTransactions?.filter(
    (transaction) =>
      transaction.crmDocument !== null || transaction.type !== null
  );

  const unconfirmedTransactions = allTransactions?.filter(
    (transaction) =>
      transaction.crmDocument === null && transaction.type === null
  );

  const handleUpdateTransactionType = async (
    transactionId: string,
    typeId: string | null
  ) => {
    await updateTransactionType(transactionId, typeId);
    queryClient.invalidateQueries({ queryKey: ["report", params.id] });
  };

  const handleNextStep = () => {
    updateReport(params.id, {
      status: ReportStatus.EXPENSES,
      cashBalance: report!.cashBalance,
      date: report!.date,
    });
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isReportLoading || isTransactionTypesLoading}
        loaderProps={{ children: <Loader color="blue" /> }}
      />

      <Flex gap={12}>
        <UnstyledButton
          onClick={() => setTab("all")}
          bg={tab === "all" ? "indigo.0" : "gray.1"}
          py={8}
          px={12}
          miw={220}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            borderRadius: "8px",
            border:
              tab === "all"
                ? "1px solid var(--mantine-color-indigo-4)"
                : "1px solid var(--mantine-color-gray-3)",
          }}
        >
          <Text>Всего</Text>
          <Title order={3}>
            {allTransactions
              ?.reduce((acc, transaction) => acc + transaction.amount, 0)
              .toLocaleString("ru-RU")}
          </Title>
        </UnstyledButton>
        <UnstyledButton
          onClick={() => setTab("confirmed")}
          bg={tab === "confirmed" ? "indigo.0" : "gray.1"}
          py={8}
          px={12}
          miw={220}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            borderRadius: "8px",
            border:
              tab === "confirmed"
                ? "1px solid var(--mantine-color-indigo-4)"
                : "1px solid var(--mantine-color-gray-3)",
          }}
        >
          <Text>Подтвержденные</Text>
          <Title order={3}>
            {confirmedTransactions
              ?.reduce((acc, transaction) => acc + transaction.amount, 0)
              .toLocaleString("ru-RU")}
          </Title>
        </UnstyledButton>
        <UnstyledButton
          onClick={() => setTab("unconfirmed")}
          bg={tab === "unconfirmed" ? "indigo.0" : "gray.1"}
          py={8}
          px={12}
          miw={220}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            borderRadius: "8px",
            border:
              tab === "unconfirmed"
                ? "1px solid var(--mantine-color-indigo-4)"
                : "1px solid var(--mantine-color-gray-3)",
          }}
        >
          <Text>Неподтвержденные</Text>
          <Title order={3}>
            {unconfirmedTransactions
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
          {tab === "all" &&
            allTransactions?.map((row) => (
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
          {tab === "confirmed" &&
            confirmedTransactions?.map((row) => (
              <TableTr key={row.id}>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  {dayjs(row.date).format("DD.MM.YYYY")}
                </TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  {dayjs(row.date).format("HH:mm")}
                </TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>{row.amount}</TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  <Badge variant="light" color="blue" size="lg" radius="xs">
                    Подтвержден
                  </Badge>
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
          {tab === "unconfirmed" &&
            unconfirmedTransactions?.map((row) => (
              <TableTr key={row.id}>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  {dayjs(row.date).format("DD.MM.YYYY")}
                </TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  {dayjs(row.date).format("HH:mm")}
                </TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>{row.amount}</TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  <Badge variant="light" color="yellow" size="lg" radius="xs">
                    Неподтвержден
                  </Badge>
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
