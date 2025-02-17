export interface DataObject {
  [key: string]: string;
}

export type Sheet = {
  filename: string;
  docType: ParserDocumentTypes;
  data: DataObject[];
};

export type ParserDocumentTypes = "kaspi" | "halyk" | "moysklad";

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
  kaspi: {
    title: "Каспи",
    dateField: "Дата операции",
    timeField: "Время",
    sheetNumber: 0,
    rowNumber: 6,
    amountField: "Сумма к зачислению/ списанию (т)",
  },
  halyk: {
    title: "Халық",
    dateField: "Дата",
    sheetNumber: 1,
    rowNumber: 6,
    amountField: "Сумма операции",
  },
  moysklad: {
    title: "CRM",
    dateField: "Время",
    sheetNumber: 0,
    rowNumber: 7,
    amountField: "Итого",
  },
};
