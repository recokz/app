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
  ScrollArea,
} from "@mantine/core";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { bankTypes } from "../../utils";

export function ResultTable() {
  const params = useParams<{ id: string }>();

  const { data: report, isLoading: isReportLoading } = useQuery({
    queryKey: ["report", params.id],
    queryFn: () => getReport(params.id),
  });

  const bankDocuments =
    report?.documents?.filter((document) =>
      bankTypes.hasOwnProperty(document.type),
    ) || [];

  const allTransactions =
    report?.reconciliations.sort((a, b) =>
      dayjs(a.bankTransaction?.date || a.crmTransaction?.date).diff(
        dayjs(b.bankTransaction?.date || b.crmTransaction?.date),
      ),
    ) || [];

  const allIncomeTransaction = allTransactions?.filter(
    (transaction) =>
      (transaction.bankTransaction?.amount ||
        transaction.crmTransaction?.amount ||
        0) > 0,
  );

  const allExpenseTransaction = allTransactions?.filter(
    (transaction) =>
      (transaction.bankTransaction?.amount ||
        transaction.crmTransaction?.amount ||
        0) < 0,
  );

  const startCash =
    (report?.cashBalance || 0) +
    (bankDocuments?.reduce((acc, document) => {
      return acc + document.balance;
    }, 0) || 0);

  const income =
    allTransactions?.reduce(
      (acc, transaction) =>
        acc +
        (transaction.bankTransaction?.amount ||
          transaction.crmTransaction?.amount ||
          0),
      0,
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

      <ScrollArea>
        <Table>
          <TableThead>
            <TableTr>
              <TableTh></TableTh>
              {bankDocuments.map((document) => (
                <TableTh key={document.id}>
                  <Text lineClamp={1}>{document.name}</Text>
                </TableTh>
              ))}
              <TableTh>
                <Text lineClamp={1}>Наличные</Text>
              </TableTh>
              <TableTh>
                <Text lineClamp={1}>Итого</Text>
              </TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>
            <TableTr>
              <TableTd>
                <Text lineClamp={1}>На начало</Text>
              </TableTd>
              {bankDocuments.map((document) => (
                <TableTd key={document.id}>{document.balance}</TableTd>
              ))}
              <TableTd>{report?.cashBalance || 0}</TableTd>
              <TableTd>{startCash.toLocaleString("ru-RU")}</TableTd>
            </TableTr>

            <TableTr>
              <TableTd>
                <Text fw={700} lineClamp={1}>
                  Продажи за период
                </Text>
              </TableTd>
              {bankDocuments.map((document) => (
                <TableTd key={document.id}>
                  <Text fw={700} lineClamp={1}>
                    {document.transactions
                      .filter((transaction) => transaction.amount > 0)
                      .reduce(
                        (acc, transaction) => acc + transaction.amount,
                        0,
                      )}
                  </Text>
                </TableTd>
              ))}
              <TableTd>
                <Text fw={700} lineClamp={1}>
                  0
                </Text>
              </TableTd>
              <TableTd>
                <Text fw={700} lineClamp={1}>
                  {allIncomeTransaction?.reduce(
                    (acc, transaction) =>
                      acc +
                      (transaction.bankTransaction?.amount ||
                        transaction.crmTransaction?.amount ||
                        0),
                    0,
                  )}
                </Text>
              </TableTd>
            </TableTr>

            {/*<TableTr>*/}
            {/*  <TableTd>*/}
            {/*    <Text lineClamp={1}>&nbsp; &nbsp; Продажи</Text>*/}
            {/*  </TableTd>*/}
            {/*  {bankDocuments.map((document) => (*/}
            {/*    <TableTd key={document.id}>*/}
            {/*      {document.transactions*/}
            {/*        .filter((transaction) => transaction.amount > 0)*/}
            {/*        .reduce((acc, transaction) => acc + transaction.amount, 0)}*/}
            {/*    </TableTd>*/}
            {/*  ))}*/}
            {/*  <TableTd>0</TableTd>*/}
            {/*  <TableTd>*/}
            {/*    {allIncomeTransaction?.reduce(*/}
            {/*      (acc, transaction) =>*/}
            {/*        acc +*/}
            {/*        (transaction.bankTransaction?.amount ||*/}
            {/*          transaction.crmTransaction?.amount ||*/}
            {/*          0),*/}
            {/*      0,*/}
            {/*    )}*/}
            {/*  </TableTd>*/}
            {/*</TableTr>*/}

            <TableTr>
              <TableTd>
                <Text lineClamp={1}>Расходы за период</Text>
              </TableTd>
              {bankDocuments.map((document) => (
                <TableTd key={document.id}>
                  {document.transactions
                    .filter((transaction) => transaction.amount < 0)
                    .reduce((acc, transaction) => acc + transaction.amount, 0)}
                </TableTd>
              ))}
              <TableTd>0</TableTd>
              <TableTd>
                {allExpenseTransaction?.reduce(
                  (acc, transaction) =>
                    acc +
                    (transaction.bankTransaction?.amount ||
                      transaction.crmTransaction?.amount ||
                      0),
                  0,
                )}
              </TableTd>
            </TableTr>

            <TableTr>
              <TableTd>
                <Text lineClamp={1}>На конец</Text>
              </TableTd>
              {bankDocuments.map((document) => (
                <TableTd key={document.id}>
                  {document.balance +
                    document.transactions.reduce(
                      (acc, transaction) =>
                        acc + (transaction?.amount || transaction?.amount || 0),
                      0,
                    )}
                </TableTd>
              ))}
              <TableTd>{report?.cashBalance || 0}</TableTd>
              <TableTd>{endCash.toLocaleString("ru-RU")}</TableTd>
            </TableTr>
          </TableTbody>
        </Table>
      </ScrollArea>
    </Box>
  );
}
