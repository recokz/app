import {
  ParserDocumentTypes,
  DEFAULT_FIELDS,
  Transaction,
} from "@/entities/reports/types";
import { parseXLSX } from "@/entities/reports/actions/parse";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createDocument,
  removeDocument,
} from "@/entities/reports/actions/document";
import { useParams } from "next/navigation";
import { DocumentType } from "@prisma/client";
import { createTransactions } from "@/entities/reports/actions/transaction";
import { notifications } from "@mantine/notifications";

export function useSheets() {
  const params = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const { mutateAsync: createDocumentMutation } = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      console.log("success document");
    },
  });

  const { mutateAsync: createTransactionsMutation } = useMutation({
    mutationFn: createTransactions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report", params.id] });
    },
    onError: (error) => {
      notifications.show({
        title: "Ошибка сохранения данных",
        message: error instanceof Error ? error.message : "Неизвестная ошибка",
        color: "red",
      });
    },
  });

  const { mutateAsync: removeDocumentMutation } = useMutation({
    mutationFn: removeDocument,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["report", params.id] });
    },
    onError: (error) => {
      notifications.show({
        title: "Ошибка при удалении, попробуйте позже",
        message: error instanceof Error ? error.message : "Неизвестная ошибка",
        color: "red",
      });
    },
  });

  const handleFileUpload = async (
    file: File | null,
    type: string | null,
    date: Date,
    balance: number,
  ): Promise<null> => {
    if (!(type && file)) {
      return null;
    }
    const defaultFields = DEFAULT_FIELDS[type as ParserDocumentTypes];

    const response = await parseXLSX(file, date, {
      sheetNumber: defaultFields.sheetNumber,
      rowNumber: defaultFields.rowNumber,
      dateField: defaultFields.dateField,
      timeField: defaultFields.timeField,
      amountField: defaultFields.amountField,
    });

    const transactions =
      (response.data.map((item) => {
        const amount = item[defaultFields.amountField];
        return {
          amount:
            typeof amount === "number"
              ? amount
              : Number(amount.replaceAll(",", ".")),
          date: new Date(item[defaultFields.dateField]),
        };
      }) as Transaction[]) || [];

    const { id } = await createDocumentMutation({
      name: file.name,
      balance: balance,
      link: "",
      type: type as DocumentType,
      reportId: params.id,
    });

    await createTransactionsMutation({
      documentId: id,
      transactions: transactions,
    });

    return null;
  };

  return {
    handleFileUpload,
    handleRemoveSheet: removeDocumentMutation,
  };
}
