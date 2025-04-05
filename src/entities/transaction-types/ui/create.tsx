"use client";

import { Button, Flex, Modal, Select, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notifications } from "@mantine/notifications";
import { createTransactionType } from "@/entities/transaction-types/actions";
import { TransactionCategory } from "@prisma/client";

export const formSchema = z.object({
  name: z.string({ message: "Обязательное поле" }),
  type: z.enum(["income", "expense"]),
});

type SchemaType = z.infer<typeof formSchema>;

export function TransactionTypeCreate() {
  const [opened, { open, close }] = useDisclosure(false);
  const queryClient = useQueryClient();

  const form = useForm<SchemaType>({
    mode: "controlled",
    validate: zodResolver(formSchema),
    initialValues: {
      name: "",
      type: "income",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createTransactionType,
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ["transaction-types"] });
      close();
    },
    onError: (error) => {
      notifications.show({
        title: "Не удалось добавить тип транзакции",
        message: error.message,
        color: "red",
      });
    },
  });

  const handleSubmit = (values: SchemaType) => {
    mutate({
      name: values.name,
      category: values.type as TransactionCategory,
    });
  };

  return (
    <div>
      <Button onClick={open}>Добавить</Button>

      <Modal
        opened={opened}
        onClose={close}
        title="Создайте новый тип транзакции"
      >
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Flex direction="column" gap={16}>
            <TextInput label="Название" {...form.getInputProps("name")} />
            <Select
              {...form.getInputProps("type")}
              label="Тип транзакции"
              placeholder="Выберите банк"
              data={[
                { value: "income", label: "Доход" },
                { value: "expense", label: "Расход" },
              ]}
            />
            <Button type="submit" loading={isPending}>
              Добавить
            </Button>
          </Flex>
        </form>
      </Modal>
    </div>
  );
}
