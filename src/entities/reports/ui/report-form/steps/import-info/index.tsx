"use client";

import { getReport, updateReportDate } from "@/entities/reports/actions/report";
import { Box, Text, Stack, Table, Button, Flex, Skeleton } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { z } from "zod";
import { DateInput } from "@mantine/dates";
import { IconCalendarPlus } from "@tabler/icons-react";
import { useEffect } from "react";
import { ReportStatus } from "@prisma/client";

export const formSchema = z.object({
  date: z.date({ message: "Обязательное поле" }),
});

type SchemaType = z.infer<typeof formSchema>;

export const ImportInfoStepForm = () => {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { data: report, isLoading } = useQuery({
    queryKey: ["report", params.id],
    queryFn: () => getReport(params.id),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateReportDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report", params.id] });
    },
    onError: () => {},
  });

  const form = useForm<SchemaType>({
    mode: "controlled",
    validate: zodResolver(formSchema),
    initialValues: {
      date: new Date(),
    },
  });

  useEffect(() => {
    if (report) {
      form.setValues({
        date: report.startDate,
      });
    }
  }, [report]);

  const handleSubmit = async (values: SchemaType) => {
    if (!report) return;

    mutate({
      id: params.id,
      date: values.date,
      status:
        report.status === ReportStatus.import_info
          ? ReportStatus.import_bank
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
                    <Text size="md">Выберите дату или диапазон дат*</Text>
                  </Table.Th>
                  <Table.Td w="50%" bg="indigo.0" px="lg" py="lg" colSpan={2}>
                    <DateInput
                      {...form.getInputProps("date")}
                      leftSection={<IconCalendarPlus color="blue" size={20} />}
                    />
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>

            <Flex justify="end">
              <Button
                id="info-next-step"
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
