"use client";

import {
  DataObject,
  DEFAULT_FIELDS,
  ParserDocumentTypes,
  Sheet,
} from "@/entities/reports/types";
import { useForm, zodResolver } from "@mantine/form";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";
import { bankTypes, useDocumentTypeList } from "../utils";
import { IconTrash } from "@tabler/icons-react";
import { IconEye } from "@tabler/icons-react";
import {
  Button,
  Flex,
  TableTd,
  Modal,
  Stack,
  Table,
  TableTbody,
  TableTh,
  TableTr,
  Text,
  NumberInput,
  Select,
  FileInput,
  TableThead,
  ActionIcon,
  LoadingOverlay,
  Box,
  Loader,
} from "@mantine/core";
import { DynamicTable } from "@/features/dynamic-table";
import { DateInput } from "@mantine/dates";
import { IconCalendarPlus } from "@tabler/icons-react";
import { parseXLSX } from "@/entities/reports/actions/parse";
import { ReportStatus, BankType } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { updateReport, getReport } from "@/entities/reports/actions/report";
import { createBankDoc } from "@/entities/reports/actions/bank-doc";

const formSchema = z.object({
  date: z.date({ message: "Обязательное поле" }),
  cash_balance: z.number(),
  bank_balance: z.array(
    z.object({
      bank: z.nativeEnum(BankType),
      balance: z.number(),
    })
  ),
  bank_file_type: z.string().nullable(),
  bank_file: z.instanceof(File).nullable(),
  crm_file_type: z.string().nullable(),
  crm_file: z.instanceof(File).nullable(),
});

type SchemaType = z.infer<typeof formSchema>;

export function ImportForm() {
  const params = useParams<{ id: string }>();
  const [bank, setBank] = useState<string | null>(null);
  const [sheets, setSheets] = useState<Array<Sheet>>([]);
  const [previewSheet, setPreviewSheet] = useState<Sheet | undefined>(
    undefined
  );
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

  const handleFileUpload = async (file: File | null, type: string | null) => {
    const formValues = form.getValues();
    console.log("handleFileUpload", type, file);
    if (type && file) {
      const defaultFields = DEFAULT_FIELDS[type as ParserDocumentTypes];

      const response: { data: DataObject[] } = await parseXLSX({
        file: file,
        date: formValues.date ?? new Date(),
        sheetNumber: defaultFields.sheetNumber,
        rowNumber: defaultFields.rowNumber,
        dateField: defaultFields.dateField,
        amountField: defaultFields.amountField,
      });

      setSheets((prevSheets) => [
        ...prevSheets,
        {
          filename: file.name,
          docType: type as ParserDocumentTypes,
          data: response.data,
        },
      ]);

      form.setFieldValue("bank_file_type", null);
      form.setFieldValue("bank_file", null);
    }
  };

  const handleRemoveSheet = (index: number) => {
    setSheets((prevSheets) => prevSheets.filter((_, i) => i !== index));
  };

  const handleReset = () => {
    form.reset();
    setSheets([]);
    setBank(null);
  };

  const handleSubmit = async (values: SchemaType) => {
    console.log("onSubmit", params.id, values, sheets);
    setIsLoading(true);

    await updateReport(params.id, {
      date: values.date,
      status: ReportStatus.IMPORT,
      cashBalance: values.cash_balance,
    });

    console.log("report", report);

    for (const item of values.bank_balance) {
      const bankDoc = report?.bankDocuments.some(
        (doc) => doc.type === item.bank
      );

      if (!bankDoc) {
        await createBankDoc(item.bank, item.balance, params.id, item.bank);
      }
    }

    setIsLoading(false);

    // Reconcilation transactions

    // Create a bank transactions

    // sheets.forEach(async (sheet) => {
    //   const bankDoc = await createBankDoc(
    //     sheet.filename,
    //     values.bank_balance.find((item) => item.bank === sheet.docType)
    //       ?.balance || 0,
    //     params.id
    //   );
    //   sheets
    //     .map((sheet) => parseTransactions(sheet.data, sheet.docType))
    //     .forEach(async (item) => {
    //       item.forEach(async (transaction) => {
    //         await createBankTransaction(
    //           bankDoc.id,
    //           transaction.amount,
    //           transaction.date.toISOString(),
    //           ""
    //         );
    //       });
    //     });
    // });
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
                      handleFileUpload(file, form.getValues().bank_file_type)
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
                    onChange={(file) =>
                      handleFileUpload(file, form.getValues().crm_file_type)
                    }
                  />
                </TableTd>
              </TableTr>
            </TableTbody>
          </Table>

          {sheets.length > 0 ? (
            <Table withTableBorder>
              <TableThead>
                <TableTr>
                  <TableTh>название</TableTh>
                  <TableTh>тип</TableTh>
                  <TableTh>транзакции</TableTh>
                  <TableTh>превью</TableTh>
                  <TableTh>очистить</TableTh>
                </TableTr>
              </TableThead>
              <TableTbody>
                {sheets.map((sheet, index) => (
                  <TableTr key={index}>
                    <TableTd>{sheet.filename}</TableTd>
                    <TableTd>{sheet.docType}</TableTd>
                    <TableTd>{sheet.data?.length || 0}</TableTd>
                    <TableTd>
                      <ActionIcon
                        variant="transparent"
                        c="gray.7"
                        onClick={() => {
                          setPreviewSheet(sheet);
                        }}
                      >
                        <IconEye />
                      </ActionIcon>
                    </TableTd>
                    <TableTd>
                      <ActionIcon
                        variant="transparent"
                        c="gray.7"
                        onClick={() => handleRemoveSheet(index)}
                      >
                        <IconTrash />
                      </ActionIcon>
                    </TableTd>
                  </TableTr>
                ))}
              </TableTbody>
            </Table>
          ) : null}

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

      <Modal
        opened={!!previewSheet}
        onClose={() => setPreviewSheet(undefined)}
        size="100%"
      >
        <DynamicTable data={previewSheet?.data || []} />
      </Modal>
    </Box>
  );
}
