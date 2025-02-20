"use client";

import { useForm, zodResolver } from "@mantine/form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { bankTypes, useDocumentTypeList } from "../../utils";
import {
  Button,
  Flex,
  TableTd,
  Stack,
  Table,
  TableTbody,
  TableTh,
  TableTr,
  Text,
  NumberInput,
  Select,
  FileInput,
  LoadingOverlay,
  Box,
  Loader,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCalendarPlus } from "@tabler/icons-react";
import { ReportStatus } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { updateReport, getReport } from "@/entities/reports/actions/report";
import {
  createBankDoc,
  createCrmDoc,
  createTransaction,
  reconcileTransactions,
} from "@/entities/reports/actions/document";
import { SchemaType, formSchema } from "./schema";
import { useSheets } from "./use-sheets";
import { SheetsTable } from "./sheets-table";
import { showNotification } from "@mantine/notifications";

export function ImportForm() {
  const params = useParams<{ id: string }>();
  const [bank, setBank] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<SchemaType>({
    mode: "controlled",
    validate: zodResolver(formSchema),
    initialValues: {
      date: new Date(),
      cash_balance: 0,
      bank_balance: [],
      bank_file_type: null,
      bank_file: null,
      crm_file_type: null,
      crm_file: null,
    },
  });

  const { data: report, isLoading: isReportLoading } = useQuery({
    queryKey: ["report", params.id],
    queryFn: () => getReport(params.id),
  });

  useEffect(() => {
    if (!report) return;

    console.log("report", report);

    form.setValues({
      date: report.date,
      cash_balance: report.cashBalance,
      bank_balance: report.bankDocuments.map((item) => ({
        bank: item.type,
        balance: item.balance,
      })),
    });

    setSheets([
      ...report.bankDocuments
        .filter((item) => item.transactions.length > 0)
        .map((item) => ({
          filename: item.name,
          docType: item.type,
          transactions: item.transactions.map((transaction) => ({
            amount: transaction.amount,
            date: transaction.date,
            crmDocument: transaction.crmDocument,
            bankDocument: null,
          })),
          data: [],
        })),
      ...report.crmDocuments.map((item) => ({
        filename: item.name,
        docType: item.type,
        transactions: item.transactions.map((transaction) => ({
          amount: transaction.amount,
          date: transaction.date,
          bankDocument: transaction.bankDocument,
          crmDocument: null,
        })),
        data: [],
      })),
    ]);
  }, [report]);

  const bankBalanceValues = form.getValues().bank_balance;

  const { bankListToBalance, bankListToParse, crmListToParse } =
    useDocumentTypeList(bankBalanceValues);

  const handlePickBank = (value: string | null) => {
    setBank(value);
    form.insertListItem("bank_balance", {
      bank: value,
      balance: 0,
    });
  };

  const { sheets, handleFileUpload, handleRemoveSheet, setSheets } =
    useSheets();

  const handleReset = () => {
    form.reset();
    setSheets([]);
    setBank(null);
  };

  const handleSubmit = async (values: SchemaType) => {
    setIsLoading(true);

    try {
      // Update a report
      await updateReport(params.id, {
        date: values.date,
        status: ReportStatus.IMPORT,
        cashBalance: values.cash_balance,
      });

      // Create a bank documents
      for (const item of values.bank_balance) {
        const existingBankDoc = report?.bankDocuments.find(
          (doc) => doc.type === item.bank
        );

        let bankDocId = existingBankDoc?.id;

        if (!bankDocId) {
          const { id } = await createBankDoc(
            item.bank,
            item.balance,
            params.id,
            item.bank
          );

          bankDocId = id;
        }

        const sheetData = sheets.find((sheet) => sheet.docType === item.bank);

        if (!sheetData?.transactions) continue;

        const existingTransactions = existingBankDoc?.transactions || [];
        const newTransactions = sheetData.transactions.filter((transaction) => {
          return !existingTransactions.some(
            (existing) =>
              existing.amount === transaction.amount &&
              existing.date.getTime() === transaction.date.getTime()
          );
        });

        if (newTransactions.length > 0) {
          await createTransaction({
            bankDocumentId: bankDocId,
            transactions: newTransactions,
          });
        }
      }
    } catch (error) {
      showNotification({
        title: "Не удалось импортировать данные",
        message: error instanceof Error ? error.message : "Неизвестная ошибка",
        color: "red",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const uploadCrmDoc = async (file: File | null) => {
    const sheet = await handleFileUpload(
      file,
      form.getValues().crm_file_type,
      form.getValues().date
    );

    if (sheet !== null) {
      form.setFieldValue("crm_file_type", null);
      form.setFieldValue("crm_file", null);

      const { id } = await createCrmDoc(sheet.filename, params.id, "MOYSKLAD");

      for (const item of report?.bankDocuments || []) {
        const { matchedCount } = await reconcileTransactions({
          crmDocumentId: id,
          bankDocumentId: item.id,
          transactions: sheet.transactions,
        });
        console.log(`${matchedCount} transactions reconciled for ${item.name}`);
      }
    }
  };

  return (
    <Box pos="relative">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <LoadingOverlay
          visible={isReportLoading || isLoading}
          loaderProps={{ children: <Loader color="blue" /> }}
        />
        <Stack gap={20}>
          <Table variant="vertical" verticalSpacing="xs" withRowBorders={false}>
            <TableTbody>
              <TableTr>
                <TableTh bg="indigo.0" px="lg" pt="lg">
                  <Text size="md">Выберите дату или диапазон дат*</Text>
                </TableTh>
                <TableTd w="50%" bg="indigo.0" px="lg" pt="lg" colSpan={2}>
                  <DateInput
                    {...form.getInputProps("date")}
                    leftSection={<IconCalendarPlus color="blue" size={20} />}
                  />
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTh bg="indigo.0" px="lg">
                  <Text size="md">
                    Введите баланс наличных на начало периода
                  </Text>
                </TableTh>
                <TableTd bg="indigo.0" px="lg" colSpan={2}>
                  <NumberInput {...form.getInputProps("cash_balance")} />
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTh bg="indigo.0" px="lg">
                  <Text size="md">
                    Введите баланс банковских счетов на начало периода
                  </Text>
                </TableTh>
                <TableTd bg="indigo.0" px="lg" colSpan={2}>
                  <Select
                    placeholder="Выберите банк"
                    value={bank}
                    onChange={handlePickBank}
                    data={bankListToBalance}
                  />
                </TableTd>
              </TableTr>
              {form.getValues().bank_balance.map((item, index) => (
                <TableTr key={index}>
                  <TableTh bg="indigo.0" px="lg"></TableTh>
                  <TableTd w="25%" bg="indigo.0" px="lg">
                    <Text>{bankTypes[item.bank]}</Text>
                  </TableTd>
                  <TableTd w="25%" bg="indigo.0" px="lg">
                    <NumberInput
                      {...form.getInputProps(`bank_balance.${index}.balance`)}
                    />
                  </TableTd>
                </TableTr>
              ))}
              <TableTr>
                <TableTh bg="indigo.0" px="lg">
                  <Text size="md">Загрузите документ из банка*</Text>
                </TableTh>
                <TableTd bg="indigo.0" pl="lg" w="25%">
                  <Select
                    {...form.getInputProps("bank_file_type")}
                    placeholder="Выберите банк"
                    data={bankListToParse}
                  />
                </TableTd>
                <TableTd bg="indigo.0" pr="lg" w="25%">
                  <FileInput
                    {...form.getInputProps("bank_file")}
                    placeholder="Загрузите документ"
                    onChange={(file) =>
                      handleFileUpload(
                        file,
                        form.getValues().bank_file_type,
                        form.getValues().date
                      ).then((sheet) => {
                        if (sheet !== null) {
                          form.setFieldValue("bank_file_type", null);
                          form.setFieldValue("bank_file", null);
                        }
                      })
                    }
                  />
                </TableTd>
              </TableTr>
              <TableTr>
                <TableTh bg="indigo.0" px="lg">
                  <Text size="md">Загрузите документ из CRM*</Text>
                </TableTh>
                <TableTd bg="indigo.0" pl="lg" w="25%">
                  <Select
                    {...form.getInputProps("crm_file_type")}
                    placeholder="Выберите CRM"
                    data={crmListToParse}
                  />
                </TableTd>
                <TableTd bg="indigo.0" pr="lg" w="25%">
                  <FileInput
                    {...form.getInputProps("crm_file")}
                    placeholder="Загрузите документ"
                    onChange={uploadCrmDoc}
                  />
                </TableTd>
              </TableTr>
            </TableTbody>
          </Table>

          <SheetsTable sheets={sheets} onRemove={handleRemoveSheet} />

          <Text size="sm" c="orange">
            Для сверки необходимо загрузить как минимум один документ из CRM и
            одну выписку из банка
          </Text>

          <Flex pt={20} justify="end" gap={8}>
            <Button variant="outline" size="lg" onClick={handleReset}>
              Очистить
            </Button>
            <Button type="submit" size="lg">
              Сохранить
            </Button>
          </Flex>
        </Stack>
      </form>
    </Box>
  );
}
