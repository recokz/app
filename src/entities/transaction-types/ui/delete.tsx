"use client";

import { IconTrash } from "@tabler/icons-react";
import { ActionIcon } from "@mantine/core";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { deleteTransactionType } from "@/entities/transaction-types/actions";

type Props = {
  id: string;
};

export function DeleteTransactionTypeButton({ id }: Props) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: deleteTransactionType,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["transaction-types"] });
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
      <IconTrash color="var(--mantine-color-dark-3)" width={20} height={20} />
    </ActionIcon>
  );
}
