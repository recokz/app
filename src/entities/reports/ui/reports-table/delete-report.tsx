"use client";

import { IconTrash } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import { deleteReport } from "../../actions/report";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";

type Props = {
  id: string;
};

export function DeleteReportButton({ id }: Props) {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      router.push(`/cabinet/`);
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
    <ActionIcon
      loading={isPending}
      variant="transparent"
      onClick={() => mutate(id)}
    >
      <IconTrash color="var(--mantine-color-dark-3)" />
    </ActionIcon>
  );
}
