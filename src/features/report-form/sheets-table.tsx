import { DEFAULT_FIELDS } from "@/entities/reports/types";
import {
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
  TableTd,
  ActionIcon,
  Modal,
  ScrollArea,
} from "@mantine/core";
import { IconEye, IconTrash } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useState } from "react";
import { Document, Transaction } from "@prisma/client";

type DocumentWithTransactions = Document & {
  transactions: Transaction[];
};

interface SheetsTableProps {
  sheets: DocumentWithTransactions[];
  onRemove: (id: string) => void;
}

export function SheetsTable({ sheets, onRemove }: SheetsTableProps) {
  const [previewSheet, setPreviewSheet] = useState<
    DocumentWithTransactions | undefined
  >();

  if (sheets.length === 0) return null;

  return (
    <>
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
              <TableTd>{sheet.name}</TableTd>
              <TableTd>{DEFAULT_FIELDS[sheet.type].title}</TableTd>
              <TableTd>{sheet.transactions.length}</TableTd>
              <TableTd>
                <ActionIcon
                  variant="transparent"
                  c="gray.7"
                  onClick={() => setPreviewSheet(sheet)}
                >
                  <IconEye />
                </ActionIcon>
              </TableTd>
              <TableTd>
                <ActionIcon
                  variant="transparent"
                  c="gray.7"
                  onClick={() => onRemove(sheet.id)}
                >
                  <IconTrash />
                </ActionIcon>
              </TableTd>
            </TableTr>
          ))}
        </TableTbody>
      </Table>

      <Modal
        opened={!!previewSheet}
        onClose={() => setPreviewSheet(undefined)}
        size="100%"
      >
        <ScrollArea>
          <Table>
            <TableThead>
              <TableTr>
                <TableTh style={{ minWidth: "100px", whiteSpace: "nowrap" }}>
                  Дата
                </TableTh>
                <TableTh style={{ minWidth: "100px", whiteSpace: "nowrap" }}>
                  Время
                </TableTh>
                <TableTh style={{ minWidth: "100px", whiteSpace: "nowrap" }}>
                  Сумма
                </TableTh>
              </TableTr>
            </TableThead>
            <TableTbody>
              {previewSheet?.transactions.map((row, index) => (
                <TableTr key={index}>
                  <TableTd style={{ whiteSpace: "nowrap" }}>
                    {dayjs(row.date).format("DD.MM.YYYY")}
                  </TableTd>
                  <TableTd style={{ whiteSpace: "nowrap" }}>
                    {dayjs(row.date).format("HH:mm")}
                  </TableTd>
                  <TableTd style={{ whiteSpace: "nowrap" }}>
                    {row.amount}
                  </TableTd>
                </TableTr>
              ))}
            </TableTbody>
          </Table>
        </ScrollArea>
      </Modal>
    </>
  );
}
