"use client";

import {
  getReport,
  updateReportStatus,
} from "@/entities/reports/actions/report";
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
import { ReportStatus, TransactionCategory } from "@prisma/client";
import { getTransactionTypes } from "@/entities/reports/actions/transaction-type";
import { updateTransactionType } from "../../actions/reconcilation";

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
      queryKey: ["transaction-types", TransactionCategory.income],
      queryFn: () => getTransactionTypes(TransactionCategory.income),
    });

  const allTransactions =
    report?.reconciliations
      ?.filter(
        (trx) =>
          (trx.bankTransaction?.amount || trx.crmTransaction?.amount || 0) > 0,
      )
      .sort((a, b) =>
        dayjs(a.bankTransaction?.date || a.crmTransaction?.date).diff(
          dayjs(b.bankTransaction?.date || b.crmTransaction?.date),
        ),
      ) || [];

  const confirmedTransactions = allTransactions.filter(
    (trx) =>
      (trx.bankTransactionId && trx.crmTransactionId) ||
      (trx.bankTransactionId && trx.typeId) ||
      (trx.crmTransactionId && trx.typeId),
  );

  const unconfirmedTransactions = allTransactions.filter(
    (trx) => !trx.crmTransactionId && !trx.typeId,
  );

  const handleUpdateTransactionType = async (
    transactionId: string,
    typeId: string | null,
  ) => {
    await updateTransactionType(transactionId, typeId);
    queryClient.invalidateQueries({ queryKey: ["report", params.id] });
  };

  const handleNextStep = async () => {
    await updateReportStatus({
      id: params.id,
      status: ReportStatus.expenses,
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
              ?.reduce(
                (acc, transaction) =>
                  acc +
                  (transaction.bankTransaction?.amount ||
                    transaction.crmTransaction?.amount ||
                    0),
                0,
              )
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
              ?.reduce(
                (acc, transaction) =>
                  acc +
                  (transaction.bankTransaction?.amount ||
                    transaction.crmTransaction?.amount ||
                    0),
                0,
              )
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
              ?.reduce(
                (acc, transaction) =>
                  acc +
                  (transaction.bankTransaction?.amount ||
                    transaction.crmTransaction?.amount ||
                    0),
                0,
              )
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
                  {dayjs(
                    row.bankTransaction?.date || row.crmTransaction?.date,
                  ).format("DD.MM.YYYY")}
                </TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  {dayjs(
                    row.bankTransaction?.date || row.crmTransaction?.date,
                  ).format("HH:mm")}
                </TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  {row.bankTransaction?.amount || row.crmTransaction?.amount}
                </TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  {row.crmTransactionId || row.typeId ? (
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
                  {dayjs(
                    row.bankTransaction?.date || row.crmTransaction?.date,
                  ).format("DD.MM.YYYY")}
                </TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  {dayjs(
                    row.bankTransaction?.date || row.crmTransaction?.date,
                  ).format("HH:mm")}
                </TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  {row.bankTransaction?.amount || row.crmTransaction?.amount}
                </TableTd>
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
                  {dayjs(
                    row.bankTransaction?.date || row.crmTransaction?.date,
                  ).format("DD.MM.YYYY")}
                </TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  {dayjs(
                    row.bankTransaction?.date || row.crmTransaction?.date,
                  ).format("HH:mm")}
                </TableTd>
                <TableTd style={{ whiteSpace: "nowrap" }}>
                  {row.bankTransaction?.amount || row.crmTransaction?.amount}
                </TableTd>
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
