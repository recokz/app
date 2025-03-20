"use client";

import { getReport, updateReportCash } from "@/entities/reports/actions/report";
import {
  Box,
  Text,
  Stack,
  Table,
  Button,
  Flex,
  Skeleton,
  NumberInput,
  Select,
  FileInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { z } from "zod";
import { useEffect, useState } from "react";
import {
  BankDocumentType,
  bankTypes,
  useDocumentTypeList,
} from "@/entities/reports/ui/report-form/utils";
import { DocumentType, ReportStatus } from "@prisma/client";
import { useSheets } from "@/entities/reports/ui/report-form/use-sheets";
import { SheetsTable } from "@/entities/reports/ui/report-form/sheets-table";

export const formSchema = z.object({
  cash_balance: z.number(),
  bank_balance: z.array(
    z.object({
      bank: z.nativeEnum(DocumentType),
      balance: z.number(),
    }),
  ),
  bank_file_type: z.string().nullable(),
  bank_file: z.instanceof(File).nullable(),
});

type SchemaType = z.infer<typeof formSchema>;

export const ImportBankStepForm = () => {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [bank, setBank] = useState<string | null>(null);

  const { data: report, isLoading } = useQuery({
    queryKey: ["report", params.id],
    queryFn: () => getReport(params.id),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateReportCash,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report", params.id] });
    },
    onError: () => {},
  });

  const form = useForm<SchemaType>({
    mode: "controlled",
    validate: zodResolver(formSchema),
    initialValues: {
      cash_balance: 0,
      bank_balance: [],
      bank_file_type: null,
      bank_file: null,
    },
  });

  const { bankListToBalance, bankListToParse } = useDocumentTypeList(
    form.getValues().bank_balance,
  );

  const { handleFileUpload, handleRemoveSheet } = useSheets();

  useEffect(() => {
    if (report) {
      form.setValues({
        cash_balance: report.cashBalance,
        bank_balance: report.documents
          .filter((item) => bankTypes.hasOwnProperty(item.type))
          .map((item) => ({
            bank: item.type,
            balance: item.balance,
          })),
      });
    }
  }, [report]);

  const handlePickBank = (value: string | null) => {
    setBank(value);
    form.insertListItem("bank_balance", {
      bank: value,
      balance: 0,
    });
  };

  const handleSubmit = async (values: SchemaType) => {
    if (!report) return;

    mutate({
      id: params.id,
      cashBalance: values.cash_balance,
      status:
        report.status === ReportStatus.import_bank
          ? ReportStatus.import_crm
          : report.status,
    });
  };

  return (
    <Box pos="relative">
      {isLoading ? (
        <Skeleton height={146} />
      ) : (
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap={20}>
            <Table
              variant="vertical"
              verticalSpacing="xs"
              withRowBorders={false}
            >
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th bg="indigo.0" px="lg" py="lg">
                    <Text size="md">
                      Введите баланс наличных на начало периода
                    </Text>
                  </Table.Th>
                  <Table.Td w="50%" bg="indigo.0" px="lg" py="lg" colSpan={2}>
                    <NumberInput {...form.getInputProps("cash_balance")} />
                  </Table.Td>
                </Table.Tr>

                <Table.Tr>
                  <Table.Th bg="indigo.0" px="lg">
                    <Text size="md">
                      Введите баланс банковских счетов на начало периода
                    </Text>
                  </Table.Th>
                  <Table.Td bg="indigo.0" px="lg" colSpan={2}>
                    <Select
                      placeholder="Выберите банк"
                      value={bank}
                      onChange={handlePickBank}
                      data={bankListToBalance}
                    />
                  </Table.Td>
                </Table.Tr>
                {form.getValues().bank_balance.map((item, index) => (
                  <Table.Tr key={index}>
                    <Table.Th bg="indigo.0" px="lg"></Table.Th>
                    <Table.Td w="25%" bg="indigo.0" px="lg">
                      <Text>
                        {bankTypes[item.bank as keyof BankDocumentType]}
                      </Text>
                    </Table.Td>
                    <Table.Td w="25%" bg="indigo.0" px="lg">
                      <NumberInput
                        {...form.getInputProps(`bank_balance.${index}.balance`)}
                      />
                    </Table.Td>
                  </Table.Tr>
                ))}

                <Table.Tr>
                  <Table.Th bg="indigo.0" px="lg">
                    <Text size="md">Загрузите документ из банка*</Text>
                  </Table.Th>
                  <Table.Td bg="indigo.0" pl="lg" w="25%">
                    <Select
                      {...form.getInputProps("bank_file_type")}
                      placeholder="Выберите банк"
                      data={bankListToParse}
                    />
                  </Table.Td>
                  <Table.Td bg="indigo.0" pr="lg" w="25%">
                    <FileInput
                      {...form.getInputProps("bank_file")}
                      placeholder="Загрузите документ"
                      onChange={(file) =>
                        handleFileUpload(
                          file,
                          form.getValues().bank_file_type,
                          report?.startDate ?? new Date(),
                          form
                            .getValues()
                            .bank_balance.find(
                              (item) =>
                                item.bank === form.getValues().bank_file_type,
                            )?.balance || 0,
                        ).then((sheet) => {
                          if (sheet !== null) {
                            form.setFieldValue("bank_file_type", null);
                            form.setFieldValue("bank_file", null);
                          }
                        })
                      }
                    />
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>

            <SheetsTable
              sheets={
                report?.documents?.filter((item) => item.type !== "moysklad") ||
                []
              }
              onRemove={handleRemoveSheet}
            />

            <Flex justify="end">
              <Button
                type="submit"
                size="lg"
                loading={isPending}
                disabled={isPending}
              >
                Следующий шаг
              </Button>
            </Flex>
          </Stack>
        </form>
      )}
    </Box>
  );
};
