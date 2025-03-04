"use client";

import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { createReport } from "@/entities/reports/actions/report";

export function CreateReportButton() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      router.push(`/cabinet/${data.id}`);
    },
    onError: (error) => {
      notifications.show({
        title: "Не удалось создать отчет",
        message: error.message,
        color: "red",
      });
    },
  });

  return (
    <Button
      onClick={() => mutate()}
      size="lg"
      rightSection={<IconPlus />}
      loading={isPending}
    >
      Начать новую сверку
    </Button>
  );
}
