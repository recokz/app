"use client";

import {
  getReport,
  updateReportStatus,
} from "@/entities/reports/actions/report";
import {
  Box,
  Text,
  Stack,
  Table,
  Button,
  Flex,
  Skeleton,
  Select,
  FileInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { z } from "zod";
import { useDocumentTypeList } from "@/features/report-form/utils";
import { useSheets } from "@/features/report-form/use-sheets";
import { SheetsTable } from "@/features/report-form/sheets-table";
import { reconcileReport } from "@/features/report-form/actions/reconcilation";
import { notifications } from "@mantine/notifications";
import { ReportStatus } from "@prisma/client";

export const formSchema = z.object({
  file_type: z.string().nullable(),
  file: z.instanceof(File).nullable(),
});

type SchemaType = z.infer<typeof formSchema>;

export const ImportCrmStepForm = () => {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: report, isLoading } = useQuery({
    queryKey: ["report", params.id],
    queryFn: () => getReport(params.id),
  });

  const form = useForm<SchemaType>({
    mode: "controlled",
    validate: zodResolver(formSchema),
    initialValues: {
      file_type: null,
      file: null,
    },
  });

  const { mutate } = useMutation({
    mutationFn: updateReportStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report", params.id] });
    },
    onError: () => {},
  });

  const { mutate: reconcileMutate } = useMutation({
    mutationFn: reconcileReport,
    onSuccess: () => {
      mutate({
        id: params.id,
        status: ReportStatus.sales,
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Ошибка реконсиляции",
        message: error.message,
        color: "red",
      });
    },
  });

  const { crmListToParse } = useDocumentTypeList([]);

  const { handleFileUpload, handleRemoveSheet } = useSheets();

  const handleSubmit = async () => {
    if (!report) return;

    reconcileMutate(params.id);
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
                  <Table.Th bg="indigo.0" px="lg">
                    <Text size="md">Загрузите документ из CRM*</Text>
                  </Table.Th>
                  <Table.Td bg="indigo.0" pl="lg" w="25%">
                    <Select
                      {...form.getInputProps("file_type")}
                      placeholder="Выберите CRM"
                      data={crmListToParse}
                    />
                  </Table.Td>
                  <Table.Td bg="indigo.0" pr="lg" w="25%">
                    <FileInput
                      {...form.getInputProps("file")}
                      placeholder="Загрузите документ"
                      onChange={(file) =>
                        handleFileUpload(
                          file,
                          form.getValues().file_type,
                          report?.startDate ?? new Date(),
                          0,
                        ).then((sheet) => {
                          if (sheet !== null) {
                            form.setFieldValue("file_type", null);
                            form.setFieldValue("file", null);
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
                report?.documents.filter((item) => item.type === "moysklad") ||
                []
              }
              onRemove={handleRemoveSheet}
            />

            <Flex justify="end">
              <Button type="submit" size="lg">
                Следующий шаг
              </Button>
            </Flex>
          </Stack>
        </form>
      )}
    </Box>
  );
};
