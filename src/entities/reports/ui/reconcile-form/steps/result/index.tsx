"use client";

import { getReport } from "@/entities/reports/actions/report";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Flex,
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
} from "@mantine/core";
import { useParams } from "next/navigation";
import dayjs from "dayjs";

export function ResultTable() {
  const params = useParams<{ id: string }>();

  const { data: report, isLoading: isReportLoading } = useQuery({
    queryKey: ["report", params.id],
    queryFn: () => getReport(params.id),
  });

  const allTransactions = report?.bankDocuments
    .flatMap((document) => document.transactions)
    .sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

  const allIncomeTransaction = allTransactions?.filter(
    (transaction) => transaction.amount > 0
  );

  const allExpenseTransaction = allTransactions?.filter(
    (transaction) => transaction.amount < 0
  );

  const startCash =
    (report?.cashBalance || 0) +
    (report?.bankDocuments?.reduce((acc, document) => {
      return acc + document.balance;
    }, 0) || 0);

  const income =
    allTransactions?.reduce(
      (acc, transaction) => acc + transaction.amount,
      0
    ) || 0;

  const endCash = startCash + income;

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={isReportLoading}
        loaderProps={{ children: <Loader color="blue" /> }}
      />

      <Flex gap={12}>
        <UnstyledButton
          bg="gray.1"
          py={8}
          px={12}
          miw={220}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            borderRadius: "8px",
            border: "1px solid var(--mantine-color-gray-3)",
          }}
        >
          <Text>На начало</Text>
          <Title order={3}>{startCash.toLocaleString("ru-RU")}</Title>
        </UnstyledButton>
        <UnstyledButton
          bg="gray.1"
          py={8}
          px={12}
          miw={220}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            borderRadius: "8px",
            border: "1px solid var(--mantine-color-gray-3)",
          }}
        >
          <Text>На конец</Text>
          <Title order={3}>{endCash.toLocaleString("ru-RU")}</Title>
        </UnstyledButton>
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
          <Text>Доход</Text>
          <Title order={3}>{income.toLocaleString("ru-RU")}</Title>
        </UnstyledButton>
      </Flex>

      <Table>
        <TableThead>
          <TableTr>
            <TableTh></TableTh>
            {report?.bankDocuments.map((document) => (
              <TableTh key={document.id}>{document.name}</TableTh>
            ))}
            <TableTh>Наличные</TableTh>
            <TableTh>Итого</TableTh>
          </TableTr>
        </TableThead>
        <TableTbody>
          <TableTr>
            <TableTd>На начало</TableTd>
            {report?.bankDocuments.map((document) => (
              <TableTd key={document.id}>{document.balance}</TableTd>
            ))}
            <TableTd>{report?.cashBalance || 0}</TableTd>
            <TableTd>{startCash.toLocaleString("ru-RU")}</TableTd>
          </TableTr>

          <TableTr>
            <TableTd>Продажи за период</TableTd>
            {report?.bankDocuments.map((document) => (
              <TableTd key={document.id}>
                {document.transactions
                  .filter((transaction) => transaction.amount > 0)
                  .reduce((acc, transaction) => acc + transaction.amount, 0)}
              </TableTd>
            ))}
            <TableTd>0</TableTd>
            <TableTd>
              {allIncomeTransaction?.reduce(
                (acc, transaction) => acc + transaction.amount,
                0
              )}
            </TableTd>
          </TableTr>

          <TableTr>
            <TableTd>Расходы за период</TableTd>
            {report?.bankDocuments.map((document) => (
              <TableTd key={document.id}>
                {document.transactions
                  .filter((transaction) => transaction.amount < 0)
                  .reduce((acc, transaction) => acc + transaction.amount, 0)}
              </TableTd>
            ))}
            <TableTd>0</TableTd>
            <TableTd>
              {allExpenseTransaction?.reduce(
                (acc, transaction) => acc + transaction.amount,
                0
              )}
            </TableTd>
          </TableTr>

          <TableTr>
            <TableTd>На конец</TableTd>
            {report?.bankDocuments.map((document) => (
              <TableTd key={document.id}>
                {document.balance +
                  document.transactions.reduce(
                    (acc, transaction) => acc + transaction.amount,
                    0
                  )}
              </TableTd>
            ))}
            <TableTd>{report?.cashBalance || 0}</TableTd>
            <TableTd>{endCash.toLocaleString("ru-RU")}</TableTd>
          </TableTr>
        </TableTbody>
      </Table>
    </Box>
  );
}
