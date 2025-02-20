import { BankDocument, CrmDocument } from "@prisma/client";

export interface DataObject {
  [key: string]: string;
}

export interface Transaction {
  amount: number;
  date: Date;
  bankDocument: BankDocument | null | undefined;
  crmDocument: CrmDocument | null | undefined;
}

export type Sheet = {
  filename: string;
  docType: ParserDocumentTypes;
  data: DataObject[];
  transactions: Transaction[];
};

export type ParserDocumentTypes = "KASPI" | "HALYK" | "MOYSKLAD";

export type ParserDocumentFields = {
  title: string;
  dateField: string;
  timeField?: string;
  sheetNumber: number;
  rowNumber: number;
  amountField: string;
};

export type ParserDefaultFields = Record<
  ParserDocumentTypes,
  ParserDocumentFields
>;

export const DEFAULT_FIELDS: ParserDefaultFields = {
  KASPI: {
    title: "Каспи",
    dateField: "Дата операции",
    timeField: "Время",
    sheetNumber: 0,
    rowNumber: 6,
    amountField: "Сумма к зачислению/ списанию (т)",
  },
  HALYK: {
    title: "Халық",
    dateField: "Дата",
    sheetNumber: 1,
    rowNumber: 6,
    amountField: "Сумма операции",
  },
  MOYSKLAD: {
    title: "CRM",
    dateField: "Время",
    sheetNumber: 0,
    rowNumber: 7,
    amountField: "Итого",
  },
};
