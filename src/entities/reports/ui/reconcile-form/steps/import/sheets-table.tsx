import { Sheet, DEFAULT_FIELDS } from "@/entities/reports/types";
import { DynamicTable } from "@/features/dynamic-table";
import {
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
  TableTd,
  ActionIcon,
  Modal,
} from "@mantine/core";
import { IconEye, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

interface SheetsTableProps {
  sheets: Sheet[];
  onRemove: (index: number) => void;
}

export function SheetsTable({ sheets, onRemove }: SheetsTableProps) {
  const [previewSheet, setPreviewSheet] = useState<Sheet | undefined>();

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
              <TableTd>{sheet.filename}</TableTd>
              <TableTd>{DEFAULT_FIELDS[sheet.docType].title}</TableTd>
              <TableTd>{sheet.data?.length || 0}</TableTd>
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
                  onClick={() => onRemove(index)}
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
        <DynamicTable data={previewSheet?.data || []} />
      </Modal>
    </>
  );
}
