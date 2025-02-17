"use client";

import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createReport } from "../../actions/create";

export function CreateReportButton() {
  const router = useRouter();

  const { mutate, isPending } = useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      router.push(`/cabinet/${data.id}`);
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
