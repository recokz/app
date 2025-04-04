import { Document } from "@prisma/client";

export interface DataObject {
  [key: string]: string | number;
}

export interface Transaction {
  amount: number;
  date: Date;
  document: Document | null | undefined;
}

export type Sheet = {
  filename: string;
  docType: ParserDocumentTypes;
  data: DataObject[];
  transactions: Transaction[];
};

export type ParserDocumentTypes =
  | "kaspi"
  | "kaspi_sales"
  | "halyk"
  | "moysklad";

export type ParserDocumentFields = {
  title: string;
  dateField: string;
  timeField?: string;
  sheetNumber: number;
  rowNumber: number | number[];
  amountField: string;
};

export type ParserDefaultFields = Record<
  ParserDocumentTypes,
  ParserDocumentFields
>;

export const DEFAULT_FIELDS: ParserDefaultFields = {
  kaspi: {
    title: "Каспи",
    dateField: "Дата операции",
    timeField: "Время",
    sheetNumber: 0,
    rowNumber: [5, 8],
    amountField: "Сумма к зачислению/ списанию (т)",
  },
  kaspi_sales: {
    title: "Каспи продажи",
    dateField: "Дата операции",
    timeField: "Время операции",
    sheetNumber: 0,
    rowNumber: [16, 19],
    amountField: "Сумма операции",
  },
  halyk: {
    title: "Халық",
    dateField: "Дата",
    sheetNumber: 1,
    rowNumber: [5, 7],
    amountField: "Сумма операции",
  },
  moysklad: {
    title: "CRM",
    dateField: "Время",
    sheetNumber: 0,
    rowNumber: [6, 8],
    amountField: "Итого",
  },
};
